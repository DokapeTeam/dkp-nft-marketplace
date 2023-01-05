import React, {useState} from 'react';
import {ethers} from 'ethers'
import Web3Modal from 'web3modal'
import {create as ipfsHttpClient} from 'ipfs-http-client'
import {marketAddress, nftAddress} from '../../../config'
import NFT from '../../../artifacts/contracts/NFT.sol/NFT.json'
import DKPMarket from '../../../artifacts/contracts/DKPMarketplace.sol/DKPMarketplace.json'
import {useNavigate} from "react-router-dom";
import {Buffer} from 'buffer';
import {Dropdown} from "react-bootstrap";
import {categories} from "../../../constants";


const PROJECT_ID = "2JFoDYyLmU99VLEK2Kl2NreVPkG";
const PROJECT_SECRET = "29a1de640039d0a1376e72f618de1287";

const auth = 'Basic ' + Buffer.from(`${PROJECT_ID}:${PROJECT_SECRET}`).toString('base64');

const client = ipfsHttpClient({
    host: 'ipfs.infura.io', port: 5001, protocol: 'https', url: "https://ipfs.infura.io:5001/api/v0", headers: {
        authorization: auth,
    },
})

const Create = () => {
    const [fileUrl, setFileUrl] = useState(null)
    const [fileName, setFileName] = useState(null)
    const [formInput, updateFormInput] = useState({
        price: '', name: '', description: '', category: '',
    })
    const navigate = useNavigate()

    // set up a function to fireoff when we update files in our form - we can add our
    // NFT images - IPFS

    async function onChange(e) {
        const file = e.target.files[0]
        try {
            const added = await client.add(file, {
                progress: (prog) => console.log(`received: ${prog}`)
            })
            const url = `https://ipfs.io/ipfs/${added.path}`
            setFileUrl(url)
            setFileName(file.name)
            console.log(fileUrl)
        } catch (error) {
            console.log('Error uploading file:', error)
        }
    }

    async function createMarket() {
        const {name, description, price, category} = formInput
        if (!name || !description || !price || !category || !fileUrl) {
            console.log(`${name}   ${description}   ${price}   ${category}   ${fileUrl} `)
            return
        }
        // upload to IPFS
        const data = JSON.stringify({
            name, description, image: fileUrl,
        })
        try {
            const added = await client.add(data)
            const url = `https://ipfs.io/ipfs/${added.path}`
            // run a function that creates sale and passes in the url
            await createSale(url)
        } catch (error) {
            console.log('Error uploading file:', error)
        }
    }

    async function createSale(url) {
        // create the items and list them on the marketplace
        const web3Modal = new Web3Modal()
        const connection = await web3Modal.connect()
        const provider = new ethers.providers.Web3Provider(connection)
        const signer = provider.getSigner()

        // we want to create the token
        let contract = new ethers.Contract(nftAddress, NFT.abi, signer)
        let transaction = await contract.mintToken(url)
        let tx = await transaction.wait()
        console.log(tx)
        let event = tx.events[0]
        console.log(event)
        let value = event.args[2]
        let tokenId = value.toNumber()
        const price = ethers.utils.parseUnits(formInput.price, 'ether')

        // list the item for sale on the marketplace
        contract = new ethers.Contract(marketAddress, DKPMarket.abi, signer)
        let listingPrice = await contract.getListingPrice()
        listingPrice = listingPrice.toString()

        transaction = await contract.makeMarketItem(nftAddress, tokenId, price, formInput.category, {value: listingPrice})
        await transaction.wait()
        await navigate('/')
    }

    return (<section className="tf-section create-item pd-top-0 mg-t-40">
        <div className="container">
            <div className="row">
                <div className="col-md-12">
                    <div className="form-create-item-content">
                        <div className="form-create-item">
                            <div className="sc-heading">
                                <h3>Mint Token</h3>
                                <p className="desc">Most popular gaming digital nft market place </p>
                            </div>
                            <div id="create-item-1">
                                <label className="uploadFile">
                                    <span className="filename">{fileName ? fileName : 'Choose image'}</span>
                                    <input type="file" className="inputfile form-control" name="file"
                                           onChange={onChange}/>
                                    <span className="icon"><i className="far fa-cloud-upload"></i></span>
                                </label>
                                <div className="input-group">
                                    <input name="name" type="text" placeholder="Item Name" required
                                           autoComplete='off'
                                           onChange={e => updateFormInput({...formInput, name: e.target.value})}/>
                                    <input name="number" type="number" placeholder="Item Price" autoComplete='off'
                                           required
                                           onChange={e => {
                                               updateFormInput({...formInput, price: e.target.value})
                                           }}/>
                                </div>
                                {/*<div className="input-group">*/}
                                {/*    <input name="name" type="text" placeholder="Royality" required/>*/}
                                {/*    <input name="number" type="text" placeholder="Size" required/>*/}
                                {/*</div>*/}
                                <div className="input-group">
                                    {/*<input name="name" type="text" placeholder="Category" required*/}
                                    {/*       autoComplete='off'*/}
                                    {/*       style={{marginRight: 0}} onChange={e => {*/}
                                    {/*    updateFormInput({*/}
                                    {/*        ...formInput, category: e.target.value*/}
                                    {/*    })*/}
                                    {/*}}/>*/}

                                    <Dropdown className='input-dropdown'>
                                        <Dropdown.Toggle className="btn-selector nolink" id="dropdown-basic">
                                            <span>{formInput.category ? categories[formInput.category] : 'All Categories'}</span>
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu>
                                            {
                                                Object.keys(categories).map((key,index) => {
                                                    return <Dropdown.Item key={index} onClick={() => updateFormInput({
                                                        ...formInput, category: key
                                                    })}>
                                                        <span>{categories[key]}</span>
                                                    </Dropdown.Item>
                                                })
                                            }
                                        </Dropdown.Menu>
                                    </Dropdown>
                                    {/*<input name="number" type="text" placeholder="No Of Copies"*/}
                                    {/*       required/>*/}
                                </div>
                                <textarea id="comment-message" name="message" tabIndex="4"
                                          placeholder="Description" aria-required="true"
                                          style={{marginBottom: 32}}
                                          onChange={e => updateFormInput({
                                              ...formInput, description: e.target.value
                                          })}></textarea>

                                <button name="submit"
                                        className="sc-button style letter style-2" onClick={createMarket}><span>Create Item</span>
                                </button>
                            </div>
                        </div>
                        <div className="form-background">
                            {fileUrl && <img src={fileUrl} alt='dkp nft marketplace'/>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>);
};

export default Create;
