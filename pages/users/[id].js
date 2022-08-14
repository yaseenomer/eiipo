

import React from 'react'

import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import axios from 'axios'
import EIIPO from '../../artifacts/contracts/EIIPO.sol/EIIPO.json'

import {
  eiipoAddress
} from '../../config'


export async function getServerSideProps(context) {
    const {id} = context.params
    return {
      props: {id}, // will be passed to the page component as props
    }
  }

export default function User({id}) {

    const [nfts, setNfts] = useState([])

    const [loadingState, setLoadingState] = useState('not-loaded')



  useEffect(() => {
    setLoadingState('loading')

    loadNFTs()
  }, [])


  async function loadNFTs() {
    /* create a generic provider and query for unsold market items */
    const provider = new ethers.providers.JsonRpcProvider()

    
    const contract = new ethers.Contract(eiipoAddress, EIIPO.abi, provider)

     const data = await contract.fetchCertificatesByuserId(id)

    /*
    *  map over items returned from smart contract and format 
    *  them as well as fetch their token metadata
    */
    const items = await Promise.all(data.map(async i => {
      const tokenUri = await contract.tokenURI(i.tokenId)
      const meta = await axios.get(tokenUri)
      
      let item = {
        tokenId: i.tokenId.toNumber(),
        seller: i.seller,
        owner: i.owner,
        userId: i.userId.toNumber(),
        image: meta.data.image,
        name: meta.data.name,
        description: meta.data.description,
      }
      return item
    }))
    console.log('items =>', items)

    setNfts(items)
    setLoadingState('loaded') 
  }



  return (
    <div className="container">
        <div className="row">
          {loadingState === 'not-loaded' && <div>Loading...</div>}
          {loadingState === 'loaded' && nfts.map(nft => (
            <div className="col-md-4" key={nft.tokenId}>
              <div className="card">
                <img className="card-img-top" src={nft.image} alt={nft.name} />
                <div className="card-body">
                  <h5 className="card-title">{nft.name}</h5>
                  <p className="card-text">{nft.description}</p>
                  <a href={nft.tokenUri} className="btn btn-primary">View</a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
  )
}
