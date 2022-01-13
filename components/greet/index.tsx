import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { useWeb3React } from "@web3-react/core";
import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import Greeter from "../../eth/Greeter.json";

interface Props {}

const Greet = (props: Props) => {
  const [greeting, setGreeting] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { library } = useWeb3React();

  // ! Eth
  //#region Eth | LoadGreeting
  useEffect(() => {
    loadGreeting();
  }, []);

  const loadGreeting = async () => {
    try {
      setIsLoading(true);
      const provider = new ethers.providers.JsonRpcProvider();

      const greeterContract = new ethers.Contract(
        Greeter.address,
        Greeter.abi,
        provider
      );

      const res = await greeterContract.greet();
      setGreeting(res);
      setIsLoading(false);
    } catch (error) {
      console.log("loadGreeting Error", error);
      setIsLoading(false);
    }
  };
  //#endregion

  //#region Eth | SetGreeting
  const setNewGreeting = async (newMessage: string) => {
    try {
      setIsLoading(true);

      const signer = library.getSigner();
      const greeterContract = new ethers.Contract(
        Greeter.address,
        Greeter.abi,
        signer
      );

      const transaction = await greeterContract.setGreeting(newMessage);
      await transaction.wait();
      setGreeting(newMessage);

      setIsLoading(false);
    } catch (error) {
      console.log("setNewGreeting Error", error);
      setIsLoading(false);
    }
  };
  //#endregion

  // ! Form
  //#region Form

  type IFormInputs = {
    message: string;
  };

  const schema = yup.object({
    message: yup.string().required(),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<IFormInputs>({
    resolver: yupResolver(schema),
    defaultValues: {
      message: "",
    },
  });

  const onSubmit: SubmitHandler<IFormInputs> = (data) => {
    setNewGreeting(data.message);
    reset();
  };
  //#endregion

  return (
    <div>
      <p>My Greeting: {greeting}</p>
      <form className="space-y-2" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label className="mr-3">Message</label>
          <input
            type="text"
            className="input input-bordered"
            {...register("message")}
          />
          <p className="text-red-600">{errors.message?.message}</p>
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

export default Greet;
