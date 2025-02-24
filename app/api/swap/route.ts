import { prisma } from "@/utils/prisma";
import { NextResponse } from "next/server";
import { ethers } from 'ethers';
import { main } from "@/utils/sol-transfer";
import web3, { Web3 } from 'web3';
import { ETH_RPC_URL, BSC_RPC_URL } from "@/utils/constants";
 
export async function POST(req: Request) {
  try {
    const { hash, type } = (await req.json()) as { hash: string; type: string };
    const res = await prisma.record.findUnique({ where: {hash: hash.toLocaleLowerCase()}, select: {hash: true, id: true} });
    if(res) {
      return NextResponse.json(
        { 
          status: 500,
          message: "This hash already exist",
        }
      );  
    }
    else {
      if(type == 'eth') {
        const web3 = new Web3(ETH_RPC_URL);
        const receipt = await web3.eth.getTransactionReceipt(hash);
    
        var logs;
        if(receipt.logs.length > 2) logs = receipt.logs[2];
        else logs = receipt.logs[1];

        if(logs && logs.data && logs.topics){
          const data = logs.data;
      
          const typesArray = [
            {type: 'string', name: 'userSolAddr'}, 
            {type: 'uint256', name: 'amount'}
          ];
  
          const decodedParameters = web3.eth.abi.decodeParameters(typesArray, data.toString());
          const tokenAmount = ethers.formatEther(decodedParameters.amount as string)
          const roundedAmount = parseFloat(parseFloat(tokenAmount).toFixed(3));
          const amount = Number(roundedAmount) * 1000;
          const address = decodedParameters.userSolAddr as string;
          const txRes = await main(address, amount);
          if(txRes?.status == 'ok'){
            await prisma.record.create({data:{hash: hash.toLowerCase()}, select: {id: true}});
            return NextResponse.json(
              {
                status: 200,
                message: txRes.txId
              }
            );
          } else {
            return NextResponse.json(
              {
                status: 500,
                message: 'transaction failed!'
              }
            );
          }
        }
      } else if(type == 'bsc') {
        const web3 = new Web3(BSC_RPC_URL);
        const receipt = await web3.eth.getTransactionReceipt(hash);

        var logs;
        if(receipt.logs.length > 2) logs = receipt.logs[2];
        else logs = receipt.logs[1];

        if(logs && logs.data && logs.topics){
          const data = logs.data;
      
          const typesArray = [
            {type: 'string', name: 'userSolAddr'}, 
            {type: 'uint256', name: 'amount'}
          ];
  
          const decodedParameters = web3.eth.abi.decodeParameters(typesArray, data.toString());
          const tokenAmount = ethers.formatEther(decodedParameters.amount as string);
          const roundedAmount = parseFloat(parseFloat(tokenAmount).toFixed(3));
          const amount = Number(roundedAmount) * 1000;
          const address = decodedParameters.userSolAddr as string;
          const txRes = await main(address, amount);
          if(txRes?.status == 'ok'){
            await prisma.record.create({data:{hash: hash.toLowerCase()}, select: {id: true}});
            return NextResponse.json(
              {
                status: 200,
                message: txRes.txId
              }
            );
          } else {
            return NextResponse.json(
              {
                status: 500,
                message: 'transaction failed!'
              }
            );
          }
        }

      }
    }
  } catch (error: any) {
    return NextResponse.json(
      { 
        status: 500,
        message: error.message,
       }
    );
  }
}