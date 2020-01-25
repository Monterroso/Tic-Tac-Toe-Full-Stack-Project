import axios from 'axios';

export default {
  getAllGames: async () => {
    let res = await axios.get(`/api/games`);
    return res.data || [];
  },

  getAllPlayers: async () => {
    let res = await axios.get('/api/players');
    return res.data || [];
  }
}