import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

interface IProps {}

const Form = (props: IProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInputs>({
    resolver: yupResolver(schema),
  });
  const onSubmit: SubmitHandler<IFormInputs> = (data) => {
    console.log("data", data);
  };

  return (
    <div className="m-3">
      <form className="space-y-2" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label className="mr-3">Name</label>
          <input {...register("name")} className="input input-bordered" />
          <p className="text-red-600">{errors.name?.message}</p>
        </div>
        <div>
          <label className="mr-3">Gender</label>
          <select
            {...register("gender")}
            className="select select-bordered select-accent w-full max-w-xs"
          >
            <option value="none" disabled>
              Choose your superpower
            </option>
            <option value="female">Female</option>
            <option value="male">Male</option>
            <option value="other">Other</option>
          </select>
        </div>
        <button className="btn btn-primary rounded-md">Submit</button>
      </form>
    </div>
  );
};

type IFormInputs = {
  name: string;
  gender: GenderEnum;
};

enum GenderEnum {
  female = "female",
  male = "male",
  other = "other",
}

const schema = yup
  .object({
    name: yup.string().required(),
    // age: yup.number().positive().integer().required(),
  })
  .required();

export default Form;
