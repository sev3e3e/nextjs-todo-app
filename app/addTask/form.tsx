"use client";

import { Autocomplete, TextField } from "@mui/material";
import { Tag } from "@prisma/client";
import { useForm, SubmitHandler, Controller } from "react-hook-form";

type Inputs = {
    name: string;
    priority: "high" | "medium" | "normal" | "low";
    // status: "Not started" | "In progress" | "Completed";
    body: string;
    expireAt: Date;
    tags: string[];
};

function AddTaskForm({ tags }: { tags: Tag[] }) {
    const {
        control,
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<Inputs>();

    const onSubmit: SubmitHandler<Inputs> = (data) => console.log(data);

    return (
        <div>
            <form onSubmit={handleSubmit(onSubmit)}>
                {/* register your input into the hook by invoking the "register" function */}
                <div>
                    <label>name</label>
                    <input {...register("name", { required: true })} />
                    {errors.name && <span>This field is required</span>}
                </div>
                <div>
                    <label>priority</label>
                    <select {...register("priority")} value="3">
                        <option value="1">High</option>
                        <option value="2">Medium</option>
                        <option value="3">Normal</option>
                        <option value="4">Low</option>
                    </select>
                </div>

                <div>
                    <label>body</label>
                    <input {...register("body")} />
                </div>

                <div>
                    <label>expire at</label>
                    <input type="date" {...register("expireAt")} />
                </div>

                <div>
                    <label>tags</label>
                    <Controller
                        control={control}
                        name="tags"
                        render={({ field: { onChange, value } }) => (
                            <Autocomplete
                                multiple
                                options={tags}
                                getOptionLabel={(tag) => tag.name}
                                onChange={(event, values) => onChange(values)}
                                value={value}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="tag"
                                        variant="outlined"
                                        onChange={onChange}
                                    />
                                )}
                            />
                        )}
                    ></Controller>
                </div>

                <div>
                    <input type="submit" />
                </div>
            </form>
        </div>
    );
}

export default AddTaskForm;
