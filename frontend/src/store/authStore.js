import { create } from 'zustand';
import { jwtDecode } from 'jwt-decode';
import Cookies from 'js-cookie';
import axios from 'axios';

export const useAuthStore = create((set) => ({
  user: {
    token: null,
    username: null,
    userType: null,
    rating: null,
  },

  setUser: async (token) => {
    try {
      // Verify token format and decode
      if (token && token.split('.').length === 3) {
        const decoded = jwtDecode(token);

        // Fetch user rating using decoded ID
        const ratingResponse = await axios.get(
          `http://localhost:8005/ratings/${decoded.id}`
        );
        const rating =
          ratingResponse.status === 200 ? ratingResponse.data.rating : null;

        // Set user in Zustand store with token, username, userType, and rating
        set({
          user: {
            token,
            username: decoded.username,
            userType: decoded.role, // Assuming 'role' in token is 'userType'
            rating,
          },
        });
      } else {
        console.error('Invalid token format:', token);
      }
    } catch (error) {
      console.error('Error decoding token or fetching rating:', error);
    }
  },

  clearUser: () =>
    set({
      user: { token: null, username: null, userType: null, rating: null },
    }),

  isAuthenticated: () => !!useAuthStore.getState().user.token,
}));

// Initialize user function to load from cookies on app load
export function initialiseUser() {
  const token = Cookies.get('session_token');
  console.log('Token from Cookie on Init:', token); // Debugging line

  if (token) {
    useAuthStore.getState().setUser(token); // Set user with token from cookie
  }
}
