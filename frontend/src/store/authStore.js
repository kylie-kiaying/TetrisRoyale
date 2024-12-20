import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { jwtDecode } from 'jwt-decode';
import Cookies from 'js-cookie';
import axios from 'axios';
import { playerService } from '@/services/playerService';
import { ratingService } from '@/services/ratingService';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: {
        token: null,
        userId: null,
        username: null,
        userType: null,
        rating: null,
        profilePicture: null,
      },

      // Set only the token and core user info immediately
      setUser: (token) => {
        if (!token || token.split('.').length !== 3) {
          console.error('Invalid token format:', token);
          return;
        }

        // Decode token and set minimal user info
        const decoded = jwtDecode(token);
        set({
          user: {
            token,
            userId: decoded.id,
            username: decoded.username,
            userType: decoded.role,
            rating: null, // placeholder, to be set later
            profilePicture: null, // placeholder, to be set later
          },
        });

        // Asynchronously fetch additional user details (rating, profile picture)
        if (decoded.role === 'player') {
          Promise.all([
            ratingService.getUserRating(decoded.id),
            playerService.getPlayerDetails(decoded.id)
          ])
          .then(([ratingResponse, profileResponse]) => {
            const rating = ratingResponse?.rating || null;
            const profilePicture = profileResponse?.profile_picture || null;

            set((state) => ({
              user: {
                ...state.user,
                rating,
                profilePicture,
              },
            }));
          })
          .catch((error) => {
            console.error('Error fetching user data:', error);
          });
        }
      },

      // Clear the user session and remove the token
      clearUser: () => {
        Cookies.remove('session_token');
        set({
          user: {
            token: null,
            userId: null,
            username: null,
            userType: null,
            rating: null,
            profilePicture: null,
          },
        });
      },

      // Check if the user is authenticated (token is present)
      isAuthenticated: () => !!get().user.token,

      // Initialize user on app load if a token is found in cookies
      initialiseUser: () => {
        const token = Cookies.get('session_token');
        if (token) {
          get().setUser(token); // Initialize user with the stored token
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

// Call this function on app load to initialize user from cookie
export function initialiseUser() {
  const token = Cookies.get('session_token');
  if (token) {
    useAuthStore.getState().setUser(token);
  }
}
