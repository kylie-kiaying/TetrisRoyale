import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import { useAuthStore } from '../store/authStore';
import { successToast, errorToast } from '@/utils/toastUtils';
import axios from 'axios';

export async function login(username, password, role, router) {
  const payload = { username, password, role };

  try {
    const response = await fetch('http://localhost:8001/auth/login/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      credentials: 'include',
    });

    if (response.ok) {
      console.log('Response OK: Login successful');

      // Retrieve the token from the cookie
      const access_token = Cookies.get('session_token');

      if (
        typeof access_token !== 'string' ||
        access_token.split('.').length !== 3
      ) {
        console.error('Invalid token format:', access_token);
        errorToast('Login failed: Invalid token format.');
        return false;
      }

      // Set the user in Zustand store (fetching rating in the store)
      await useAuthStore.getState().setUser(access_token);

      successToast('Login successful!');

      // Redirect based on role
      if (role === 'admin') {
        router.push('/adminHome');
      } else {
        router.push('/playerHome');
      }

      return true;
    } else {
      const errorData = await response.json();
      errorToast('Login failed: ' + (errorData.detail || 'Unknown error'));
      return false;
    }
  } catch (error) {
    console.error('An error occurred during login:', error);
    errorToast('An error occurred during login. Please try again.');
    return false;
  }
}
