import React from "react";

import { ethers } from "ethers";

import { create as ipfsHttpClient } from "ipfs-http-client";


const projectId = "09cd5b54200546ccae835b236290b5ff";
const projectSecret = "1cd3e03a5112492590046a44c4bfb4e6";

const auth = "Basic " + Buffer.from(projectId + ":" + projectSecret,'utf8').toString("base64");
const client = ipfsHttpClient({
  url: "https://ipfs.infura.io:5001",
  port: 5001,
  protocol: "https",
  headers: {
    Authorization: auth,
  },
});

export default function createItem() {
  //  const [loading, setLoading] = React.useState(false);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];

    const added = await client.add(file);

    const url = `https://ipfs.infura.io/ipfs/${added.path}`;

    console.log(url);
  };

  return (
    <div className="container">
      <h1>Create Item</h1>
      <form>
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            className="form-control"
            id="name"
            placeholder="Enter name"
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <input
            type="text"
            className="form-control"
            id="description"
            placeholder="Enter description"
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
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
    </div>
  );
}
