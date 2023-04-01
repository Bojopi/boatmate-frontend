// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { NextApiRequest, NextApiResponse } from 'next'


 const query = async (req: NextApiRequest, res: NextApiResponse) => {
  // const response = await conn.query('SELECT NOW()')
  console.log('aqui')
}

export default query;