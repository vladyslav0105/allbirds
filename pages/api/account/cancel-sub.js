import axios from 'axios'

export default async function handler(req, res) {

  console.log("api requested cancel subscription: ", JSON.parse(req.body).email)

  const config = {
    method: 'POST',
    url: `https://davis.sitkasalmonshares.com/cancel_sub`,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': process.env.DAVIS_KEY,
      'origin': process.env.NEXT_PUBLIC_DOMAIN,
    },
    body: req.body
  };

  axios(config)
    .then((response) => {
      console.log('Cancel Subscription: ', response.data);
      res.status(200).json({ message: 'success', data: response.data });
    })
    .catch((error) => {
      console.log(error);
      res.status(400).json({ message: 'error', data: error });
    });
}

