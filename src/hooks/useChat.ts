import axios from 'axios';
import React from 'react';


export const useChat = () => {
  const [friends, setFriends] = React.useState([]);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | null>(null);

  const getFriends = async (userId: string) => {
    console.log('Fetching friends for user:', userId);
    const token = localStorage.getItem('token');
    try {
      setLoading(true);
      const res = await axios.get(`https://d-chat-backend-338h.onrender.com/api/friendsList/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (res) {
        setLoading(false);
        setFriends(res.data.friends);
        return;
      } else {
        setLoading(false);
        setError('No friends found');
      }

    } catch (error) {
      console.log(error);
      setError('Failed to fetch friends');
      setLoading(false);
    } finally {
      setLoading(false);
    }
  }





  return { friends, loading, error, getFriends };

}