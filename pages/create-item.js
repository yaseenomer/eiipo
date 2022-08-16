import React, { useState} from "react";

import { useRouter } from "next/router";

import { ethers } from "ethers";

import Web3Modal from 'web3modal'


import { create as ipfsHttpClient } from "ipfs-http-client";

import { eiipoAddress } from "../config";

import EIIPO from "../artifacts/contracts/EIIPO.sol/EIIPO.json"


const projectId = "2DLcy3dwWQm3pDdpu5S1tnaeAtV";
const projectSecret = "6b075fc393bdcb882b472c755cd2adf0";

const auth = "Basic " + Buffer.from(projectId + ":" + projectSecret,'utf8').toString("base64");
const client = ipfsHttpClient({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https",
  headers: {
    Authorization: auth,
  },
});

export default function createItem() {

  const [loading, setLoading] = React.useState(false);

  const [fileUrl, setFileUrl] = useState(null)

  const [formInput, updateFormInput] = useState({ userId: '', name: '', description: '' })

  const router = useRouter()


  const handleImageChange = async (e) => {
    const file = e.target.files[0];

    const added = await client.add(file);

    const url = `https://eiipo-ipfs.infura-ipfs.io/ipfs/${added.path}`;

    setFileUrl(url)

  };

  async function uploadToIPFS() {
    const { name, description, userId } = formInput
    if (!name || !description || !userId || !fileUrl) return

  
    /* first, upload to IPFS */
    const data = JSON.stringify({
      name, description, image: fileUrl, userId: +userId
    })
    try {
      const added = await client.add(data)
      const url = `https://eiipo-ipfs.infura-ipfs.io/ipfs/${added.path}`
      /* after file is uploaded to IPFS, return the URL to use it in the transaction */
      return url
    } catch (error) {
      console.log('Error uploading file: ', error)
    }  
  }


  async function addNft(e) {

    e.preventDefault();

    setLoading(true)
    const url = await uploadToIPFS()
    console.log({
      url
    })
    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner() 

    /* next, create the item */
    let contract = new ethers.Contract(eiipoAddress, EIIPO.abi, signer)

    console.log({
      contract
    })

    const { userId } = formInput
    let transaction = await contract.createToken(url, userId)
    await transaction.wait()
    setLoading(false)

   
    router.push('/')
  }




  return (
    <div className="container">
      <h1>Create Item</h1>
      <form onSubmit={addNft}>
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            className="form-control"
            id="name"
            placeholder="Enter name"
            onChange={(e) => updateFormInput({ ...formInput, name: e.target.value})}
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <input
            type="text"
            className="form-control"
            id="description"
            placeholder="Enter description"
            onChange={(e) => updateFormInput({ ...formInput, description: e.target.value})}
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <input
            type="number"
            className="form-control"
            id="userId"
            placeholder="Enter User Id"
            onChange={(e) => updateFormInput({ ...formInput, userId: e.target.value})}
          />
        </div>
        <div className="form-group">
          <label htmlFor="image">Image</label>
          <input
            type="file"
            className="form-control"
            onChange={handleImageChange}
            id="image"
            placeholder="Enter image"
            
          />
        </div>

        {
          fileUrl && (
            <img src={fileUrl} width="100px"  />
          )
        }
        <button type="submit" className="btn btn-primary" disabled={loading}>
          Submit
        </button>
      </form>
    </div>
  );
}
