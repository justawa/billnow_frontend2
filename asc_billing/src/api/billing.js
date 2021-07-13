import axios from 'axios';

const isLive = false;

const url = isLive
  ? 'https://findnearby.biz/asc_billing_2/api/'
  : 'http://127.0.0.1:8000/api/';

export default axios.create({
  baseURL: url,
});
