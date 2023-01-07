import prisma from "../../prisma/client";
import AddTaskForm from "./form";

async function AddTaskPage() {
    const tags = await prisma.tag.findMany();

    return (
        <div>
            <div>Add Task Page</div>
            <AddTaskForm tags={tags} data-superjson />
        </div>
    );
}

export default AddTaskPage;
