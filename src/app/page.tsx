"use client";
import Image from 'next/image';
import styles from './page.module.css'
import { ethers } from 'ethers';
import { ChangeEvent, useMemo, useState } from 'react';
import { EthereumClient, w3mConnectors, w3mProvider } from '@web3modal/ethereum';
import { Web3Modal } from '@web3modal/react';
import { configureChains, createConfig, usePrepareSendTransaction, useSendTransaction, WagmiConfig } from 'wagmi';
import { arbitrum, mainnet, polygon } from 'wagmi/chains';
import { Web3Button } from '@web3modal/react';
import { useAccount } from 'wagmi';
import { useDebounce } from 'use-debounce';
import { useEthersProvider } from './ethers';
import { sendTransaction } from '@wagmi/core';
import { ToastContainer, toast } from 'react-toastify';

const chains = [arbitrum, mainnet, polygon];
const projectId = 'e14d37f15600f99222e2ff44adf1bc52';

const { publicClient } = configureChains(chains, [w3mProvider({ projectId })]);
const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: w3mConnectors({ projectId, version: 1, chains }),
  publicClient
});
const ethereumClient = new EthereumClient(wagmiConfig, chains);

export default function Home() {
  
  const { connector, isConnecting, isDisconnected } = useAccount();

  const [hex, setHex] = useState<string>('');
  const [debouncedHex] = useDebounce(hex, 500);
  const [hexTo, setHexTo] = useState<string>('');
  const [debouncedHexTo] = useDebounce(hexTo, 500);

  const [text, setText] = useState<string>('');
  const [debouncedText] = useDebounce(text, 500);
  const [textType, setTextType] = useState<string>('');
  const [debouncedTextType] = useDebounce(textType, 500);
  const [textTo, setTextTo] = useState<string>('');
  const [debouncedTextTo] = useDebounce(textTo, 500);

  const onEthscribeText = async () => {
    console.log(debouncedTextTo);
    if (debouncedText == '' || debouncedTextTo == '') {
      toast.error('Text or To is blank!');
      return;
    }
    if (ethers.isAddress(debouncedTextTo)) {
      console.log(`0x${ethers.hexlify(ethers.toUtf8Bytes(`data:${debouncedTextType};${debouncedText}`)).slice(2)}`)
      toast.promise(
        sendTransaction({
          value: BigInt(0),
          to: debouncedTextTo,
          data: `0x${ethers.hexlify(ethers.toUtf8Bytes(`data:${debouncedTextType}${textType == '' ? ',' : ';'}${debouncedText}`)).slice(2)}`
        }),
        {
          success: 'ETHScription Success!',
          error: `Error ETHScribing...`,
          pending: `Sending ETHScription...`
        }
      ).then(({hash}) => {
        toast.info(`Txn. Hash: ${hash}`);
      });
    } else {
      toast.error('Invalid Address!');
    }
  }

  const onEthscribeRaw = async () => {
    console.log(debouncedTextTo);
    if (debouncedHex == '' || debouncedHexTo == '' || !debouncedHexTo.startsWith('0x')) {
      toast.error('Hex or To is blank or incorrect!');
      return;
    }
    if (ethers.isAddress(debouncedHexTo)) {
      toast.promise(
        sendTransaction({
          value: BigInt(0),
          to: debouncedHexTo,
          data: `0x${debouncedHex.slice(2)}`
        }),
        {
          success: 'ETHScription Success!',
          error: `Error ETHScribing...`,
          pending: `Sending ETHScription...`
        }
      ).then(({hash}) => {
        toast.info(`Txn. Hash: ${hash}`);
      })
    } else {
      toast.error('Invalid Address!');
    }
  }

  return (
    <>
      <WagmiConfig config={wagmiConfig}>


        <main className={styles.main}>
          <div className={styles.description}>
            <p>
              Get Started With ETHScriptions. Below you can Ethscribe raw hex data and text.<br/>
              See more information about ETHScriptions and ETHScript images <a className={styles.link} href="https://ethscriptions.com" target='_blank'>here</a>.<br/>
              This will not charge you anything! It simply formats and sends text data to Ethereum easily for you!<br/>
              Made by <a className={styles.link} href="https://twitter.com/maxbridgland" target='_blank'>@maxbridgland</a><br/>
              Source code <a className={styles.link} href="https://github.com/M4cs/ETHScriptionHelper" target='_blank'>here</a>.
            </p>
            <br/><br/>

            {!connector &&
              <p>
                <Web3Button />
              </p>
            }
            {connector &&
            <>
              <p>
                <strong>ETHScribe Text Data</strong>
                <br/><br/>
                Text:
                <input className={styles.input} onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  setText(e.target.value);
                }}>

                </input>
                <br/><br/>
                Mimetype (e.g: application/json, image/png. Leave blank for text/plain):
                <input className={styles.input} onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  setTextType(e.target.value);
                }}>

                </input>
                <br/><br/>
                Ethscribe To:
                <input className={styles.input} onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  setTextTo(e.target.value);
                }}>

                </input>
                <br/><br/>
                <button onClick={(e) => {
                  e.preventDefault();
                  onEthscribeText();
                }}>Ethscribe</button>
              </p>

              <p>
                <strong>ETHScribe Raw Data</strong>
                <br/><br/>
                Hex Data:
                <input className={styles.input} onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  setHex(e.target.value);
                }}>

                </input>
                <br/><br/>
                Ethscribe To:
                <input className={styles.input} onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  setHexTo(e.target.value);
                }}>

                </input>
                <br/><br/>
                <button onClick={(e) => {
                  e.preventDefault();
                  onEthscribeRaw();
                }}>Ethscribe</button>
              </p>
            </>
            }

            {/* <p>
              <strong>ETHScript NFT onto Blockchain</strong>
              <br/><br/>
              Warning this <strong>WILL BURN YOUR NFT IF IT'S BURNABLE</strong>
              <br/><br/>
              NFT Address:
              <input className={styles.input}>

              </input>
              <br/><br/>
              Token ID:
              <input className={styles.input}>

              </input>
              <br/><br/>
              Ethscribe To:
              <input className={styles.input}>

              </input>
            </p> */}
          </div>      
        </main>
      </WagmiConfig>
      <ToastContainer />

      <Web3Modal projectId={projectId} ethereumClient={ethereumClient} />
    </>

  )
}
