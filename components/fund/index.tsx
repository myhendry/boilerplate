import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { useWeb3React } from "@web3-react/core";
import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import Contracts from "../../eth/Contracts.json";

interface Props {}

const Fund = (props: Props) => {
  const [name, setName] = useState<string>("");
  const [nickName, setNickName] = useState<string>("");
  const [totalSupply, setTotalSupply] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { library, account } = useWeb3React();

  useEffect(() => {
    loadContract();
  }, []);

  const loadContract = async () => {
    try {
      //const provider = new ethers.providers.JsonRpcProvider();

      // Rinkeby
      const provider = new ethers.providers.InfuraProvider(
        "rinkeby",
        process.env.INFURA_RINKEBY_URL
      );

      const fundMeContract = new ethers.Contract(
        Contracts.fundMeAddress,
        Contracts.fundMeAbi,
        provider
      );

      const usdEthPrice = await fundMeContract.getPrice();
      await usdEthPrice.wait;
      console.log("usdEthPrice", usdEthPrice.toString());

      const convertEth = await fundMeContract.getConversionRate(2);
      await convertEth.wait;
      console.log("convertEth", convertEth.toString());

      const version = await fundMeContract.getVersion();
      await version.wait;
      console.log("version", version.toString());

      const owner = await fundMeContract.owner();
      console.log("owner", owner);
    } catch (error) {
      console.log(error);
    }
  };

  const fund = async () => {
    try {
      setIsLoading(true);
      const signer = library.getSigner();
      const fundMeContract = new ethers.Contract(
        Contracts.fundMeAddress,
        Contracts.fundMeAbi,
        signer
      );

      const transaction = await fundMeContract.fund({
        value: ethers.utils.parseUnits("0.1", "ether").toHexString(),
      });
      await transaction.wait;
      console.log("Fund Transaction", transaction);

      setIsLoading(false);
    } catch (error) {
      console.log("error", error);
      setIsLoading(false);
    }
  };

  const handleFund = async (e: any) => {
    e.preventDefault();
    await fund();
  };

  const withdraw = async () => {
    try {
      setIsLoading(true);
      const signer = library.getSigner();
      const fundMeContract = new ethers.Contract(
        Contracts.fundMeAddress,
        Contracts.fundMeAbi,
        signer
      );

      console.log("account", account);
      const transaction = await fundMeContract.withdraw({
        from: account,
      });
      await transaction.wait;
      console.log("Withdraw transaction", transaction);

      setIsLoading(false);
    } catch (error) {
      console.log("error", error);
      setIsLoading(false);
    }
  };

  const handleWithdraw = async (e: any) => {
    e.preventDefault();
    await withdraw();
  };

  // ! Form
  //#region Form

  type IFormInputs = {
    name: string;
  };

  const schema = yup.object({
    name: yup.string().min(2).required(),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<IFormInputs>({
    resolver: yupResolver(schema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit: SubmitHandler<IFormInputs> = (data) => {
    reset();
  };
  //#endregion

  return (
    <div>
      <p>Fund Me</p>

      <button
        onClick={handleFund}
        className="btn btn-primary rounded-md block w-1/4 my-2"
      >
        Fund
      </button>
      <button
        onClick={handleWithdraw}
        className="btn btn-primary rounded-md block w-1/4 my-2 bg-red-600"
      >
        Withdraw
      </button>

      <form className="space-y-2" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label className="mr-3">Message</label>
          <input
            type="text"
            className="input input-bordered"
            {...register("name")}
          />
          <p className="text-red-600">{errors.name?.message}</p>
        </div>

        <input
          disabled={isLoading}
          type="submit"
          value="Enter"
          className="btn btn-primary rounded-md block w-1/4"
        />
        <input
          type="reset"
          value="Reset"
          className="btn btn-primary rounded-md block w-1/4"
        />
      </form>
    </div>
  );
};

export default Fund;
