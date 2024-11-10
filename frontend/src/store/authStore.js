import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { jwtDecode } from 'jwt-decode';
import Cookies from 'js-cookie';
import axios from 'axios';

export const useAuthStore = create(
  persist(
    (set) => ({
      user: {
        token: null,
        userId: null,
        username: null,
        userType: null,
        rating: null,
      },

      // Updated setUser to remove async/await and streamline setting user data
      setUser: (token) => {
        try {
          if (token && token.split('.').length === 3) {
            const decoded = jwtDecode(token);

            if (decoded.role === 'player') {
              // Fetch user rating using decoded ID
              axios
                .get(`http://localhost:8005/ratings/${decoded.id}`)
                .then((ratingResponse) => {
                  const rating =
                    ratingResponse.status === 200
                      ? ratingResponse.data.rating
                      : null;

                  // Set user data in Zustand store
                  set({
                    user: {
                      token,
                      userId: decoded.id,
                      username: decoded.username,
                      userType: decoded.role,
                      rating,
                    },
                  });
                })
                .catch((error) => {
                  console.error('Error fetching rating:', error);
                  set({
                    user: {
                      token,
                      userId: decoded.id,
                      username: decoded.username,
                      userType: decoded.role,
                      rating: null,
                    },
                  });
                });
            } else {
              set({
                user: {
                  token,
                  userId: decoded.id,
                  username: decoded.username,
                  userType: decoded.role,
                  rating: null,
                },
              });
            }
          } else {
            console.error('Invalid token format:', token);
          }
        } catch (error) {
          console.error('Error decoding token:', error);
        }
      },

      clearUser: () => {
        Cookies.remove('session_token'); // Remove token from cookies
        set({
          user: {
            token: null,
            userId: null,
            username: null,
            userType: null,
            rating: null,
          },
        });
      },

      isAuthenticated: () => !!useAuthStore.getState().user.token,

      initialiseUser: () => {
        const token = Cookies.get('session_token');
        if (token) {
          useAuthStore.getState().setUser(token); // Initialize user if token exists
        }
      },
    }),
    {
      name: 'auth-store',
      partialize: (state) => ({
        user: state.user,
      }),
    }
  )
);

// Initialize user function to load from cookies on app load
export function initialiseUser() {
  const token = Cookies.get('session_token');
  console.log('Token from Cookie on Init:', token);

  if (token) {
    useAuthStore.getState().setUser(token);
  }
}
