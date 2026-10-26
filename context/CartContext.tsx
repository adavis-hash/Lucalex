'use client';

import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { ProductItem } from '@/data/products';
import { createClient } from '@/lib/supabase/client';
import { Database, Json } from '@/types/database.types';
import { useAuth } from './AuthContext';

type ProductRow = Database['public']['Tables']['products']['Row'];

interface CartContextType {
  cartItems: ProductItem[];
  cartCount: number;
  totalPieces: number;
  subtotal: number;
  loading: boolean;
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  addToCart: (product: ProductItem) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  checkout: (shippingAddress: {
    fullName: string;
    street: string;
    city: string;
    postalCode: string;
    country: string;
  }) => Promise<{ orderId?: string; error?: string }>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'modulo_cart_items';

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState<ProductItem[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed;
          }
        }
      } catch (e) {
        console.warn('Could not read cart from localStorage', e);
      }
    }
    return [];
  });
  const [cartId, setCartId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);

  const supabase = useMemo(() => createClient(), []);

  // Sync with Supabase when authenticated
  useEffect(() => {
    let active = true;

    async function syncUserCart() {
      if (!user) {
        setCartId(null);
        return;
      }

      try {
        setLoading(true);

        // 1. Get or create user cart in Supabase
        const { data: existingCart, error: cartFetchErr } = await supabase
          .from('carts')
          .select('id')
          .eq('user_id', user.id)
          .maybeSingle();

        let currentCartId = existingCart?.id;

        if (!currentCartId && !cartFetchErr) {
          const { data: newCart, error: createCartErr } = await supabase
            .from('carts')
            .insert({ user_id: user.id })
            .select('id')
            .single();

          if (!createCartErr && newCart) {
            currentCartId = newCart.id;
          }
        }

        if (!currentCartId) {
          console.warn('Failed to obtain cart id for user');
          return;
        }

        if (!active) return;
        setCartId(currentCartId);

        // 2. Fetch remote cart items
        const { data: remoteItems, error: itemsErr } = await supabase
          .from('cart_items')
          .select(`
            product_id,
            quantity,
            products (*)
          `)
          .eq('cart_id', currentCartId);

        if (!itemsErr && remoteItems) {
          const loadedProducts: ProductItem[] = [];

          for (const item of remoteItems) {
            const p = item.products as unknown as ProductRow | null;
            if (p) {
              loadedProducts.push({
                id: p.id,
                setNumber: p.set_number,
                name: p.name,
                collectionId: p.collection_id || '',
                collectionName: p.collection_name || '',
                pieces: p.pieces,
                age: p.age,
                price: Number(p.price),
                isNew: p.is_new,
                isFeatured: p.is_featured,
                badge: p.badge || undefined,
                image: p.image,
                tagline: p.tagline || '',
                dimensions: p.dimensions || '',
                features: Array.isArray(p.features) ? (p.features as string[]) : [],
                difficulty: p.difficulty || 'Intermediate',
              });
            }
          }

          // 3. Merge any guest items present in localStorage
          const localItemsStored = localStorage.getItem(LOCAL_STORAGE_KEY);
          if (localItemsStored) {
            try {
              const localItems: ProductItem[] = JSON.parse(localItemsStored);
              for (const loc of localItems) {
                if (!loadedProducts.some((p) => p.id === loc.id)) {
                  // Upsert to remote cart
                  await supabase
                    .from('cart_items')
                    .upsert({
                      cart_id: currentCartId,
                      product_id: loc.id,
                      quantity: 1,
                    });
                  loadedProducts.push(loc);
                }
              }
              // Clear guest cart once merged
              localStorage.removeItem(LOCAL_STORAGE_KEY);
            } catch (err) {
              console.warn('Error merging local cart:', err);
            }
          }

          if (active) {
            setCartItems(loadedProducts);
          }
        }
      } catch (err) {
        console.warn('Error synchronizing cart:', err);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    syncUserCart();

    return () => {
      active = false;
    };
  }, [user, supabase]);

  // Save guest items to localStorage
  const saveGuestCart = useCallback((items: ProductItem[]) => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.warn('Could not save cart to localStorage', e);
    }
  }, []);

  const addToCart = async (product: ProductItem) => {
    if (cartItems.some((i) => i.id === product.id)) {
      setCartOpen(true);
      return;
    }

    const updated = [...cartItems, product];
    setCartItems(updated);
    setCartOpen(true);

    if (user && cartId) {
      try {
        await supabase
          .from('cart_items')
          .upsert({
            cart_id: cartId,
            product_id: product.id,
            quantity: 1,
          });
      } catch (err) {
        console.warn('Error adding item to remote cart:', err);
      }
    } else {
      saveGuestCart(updated);
    }
  };

  const removeFromCart = async (productId: string) => {
    const updated = cartItems.filter((i) => i.id !== productId);
    setCartItems(updated);

    if (user && cartId) {
      try {
        await supabase
          .from('cart_items')
          .delete()
          .eq('cart_id', cartId)
          .eq('product_id', productId);
      } catch (err) {
        console.warn('Error removing item from remote cart:', err);
      }
    } else {
      saveGuestCart(updated);
    }
  };

  const clearCart = async () => {
    setCartItems([]);

    if (user && cartId) {
      try {
        await supabase
          .from('cart_items')
          .delete()
          .eq('cart_id', cartId);
      } catch (err) {
        console.warn('Error clearing remote cart:', err);
      }
    } else {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    }
  };

  const checkout = async (shippingAddress: {
    fullName: string;
    street: string;
    city: string;
    postalCode: string;
    country: string;
  }) => {
    if (!user) {
      return { error: 'Please sign in to complete your order.' };
    }

    if (cartItems.length === 0) {
      return { error: 'Your shopping bag is empty.' };
    }

    try {
      // Execute the secure server-side transaction create_order
      // Note: create_order reads canonical prices and quantities directly on the server
      const { data, error } = await supabase.rpc('create_order', {
        p_shipping_address: shippingAddress as unknown as Json,
      });

      if (error) {
        return { error: error.message };
      }

      // Successful order creation: database function automatically emptied cart_items in PostgreSQL
      setCartItems([]);
      localStorage.removeItem(LOCAL_STORAGE_KEY);

      return { orderId: data as string };
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Order creation failed.';
      return { error: msg };
    }
  };

  const cartCount = cartItems.length;
  const totalPieces = cartItems.reduce((acc, item) => acc + (item.pieces || 0), 0);
  const subtotal = cartItems.reduce((acc, item) => acc + (item.price || 0), 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        totalPieces,
        subtotal,
        loading,
        cartOpen,
        setCartOpen,
        addToCart,
        removeFromCart,
        clearCart,
        checkout,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
