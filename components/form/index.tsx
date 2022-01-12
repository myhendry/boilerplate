import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useDemoContext } from "../../context/demo-context";

interface IProps {}
/*
  https://daily.dev/blog/create-powerful-and-flexible-forms-with-react-hook-form
  https://stackoverflow.com/questions/67791756/react-hook-form-error-type-useformregisterformdata-is-not-assignable-to-ty
  https://github.com/react-hook-form/react-hook-form/tree/master/examples/V7
  https://react-hook-form.com/form-builder
*/
const Form = (props: IProps) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<IFormInputs>({
    resolver: yupResolver(schema),
    defaultValues: {
      title: "",
      age: 0,
      gender: GenderEnum.Other,
      developer: "Yes",
      receiveEmails: true,
    },
  });

  const { todos, saveTodo } = useDemoContext();

  const onSubmit: SubmitHandler<IFormInputs> = (data) => {
    console.log("data", data);
    saveTodo(data);
    reset();
  };

  return (
    <div className="m-3">
      <div className="py-3">
        {todos.map((t) => (
          <div key={t.id} className="border rounded-md p-3 my-2">
            <p>{t.title}</p>
          </div>
        ))}
        <form className="space-y-2" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label className="mr-3">Title</label>
            <input
              type="text"
              className="input input-bordered"
              {...register("title")}
            />
            <p className="text-red-600">{errors.title?.message}</p>
          </div>
          <div>
            <label className="mr-3">Age</label>
            <input
              type="age"
              className="input input-bordered"
              {...register("age")}
            />
            <p className="text-red-600">{errors.age?.message}</p>
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
          <div>
            <label>Are you a developer?</label>
            <span className="mx-2">Yes</span>{" "}
            <input type="radio" value="Yes" {...register("developer")} />
            <span className="mx-2">No</span>{" "}
            <input type="radio" value="No" {...register("developer")} />
          </div>
          <div>
            <label className="mr-3">Receive Emails?</label>
            <input
              type="checkbox"
              placeholder="Receive Emails"
              {...register("receiveEmails", {})}
            />
          </div>
          <input
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
    </div>
  );
};

type IFormInputs = {
  title: string;
  age: number;
  gender: GenderEnum;
  developer: string;
  receiveEmails: boolean;
};

enum GenderEnum {
  Female = "female",
  Male = "male",
  Other = "other",
}

const schema = yup
  .object({
    title: yup.string().required(),
    age: yup
      .number()
      .positive("Age must be a positive number")
      .integer()
      .required(),
  })
  .required();

export default Form;
