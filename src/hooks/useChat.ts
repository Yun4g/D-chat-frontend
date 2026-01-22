import api from '@/api/axios';
import React from 'react';


 interface UserTypes{
  _id:string
  avatarUrl: string;
  userName: string;
  roomId: string
 }

export interface FriendsType {
  _id: string;
  user: UserTypes;
  roomId: string
}

export const useChat = () => {
  const [friends, setFriends] = React.useState<FriendsType[]>([]);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | null>(null);

  const getFriends = async (userId: string) => {
    console.log('Fetching friends for user:', userId);
  
    try {
      setLoading(true);
      const res = await api.get(`/api/friendsList/${userId}` );
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