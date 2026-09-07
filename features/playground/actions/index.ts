"use server"
import { currentUser } from "@/features/auth/actions";
import { db } from "@/lib/db"
import { scanTemplateDirectory, TemplateFolder } from "../libs/path-to-json";
import { templatePaths } from "@/lib/template";
import { revalidatePath } from "next/cache";
import path from "path";


// Toggle marked status for a problem
export const toggleStarMarked = async (playgroundId: string, isChecked: boolean) => {
    const user = await currentUser();
    const userId = user?.id;
  if (!userId) {
    throw new Error("User ID is required");
  }

  try {
    if (isChecked) {
      await db.starMark.create({
        data: {
          userId: userId!,
          playgroundId,
          isMarked: isChecked,
        },
      });
    } else {
      await db.starMark.delete({
        where: {
          userId_playgroundId: {
            userId,
            playgroundId: playgroundId,

          },
        },
      });
    }

    revalidatePath("/dashboard");
    return { success: true, isMarked: isChecked };
  } catch (error) {
    console.error("Error updating problem:", error);
    return { success: false, error: "Failed to update problem" };
  }
};

export const createPlayground = async (data:{
    title: string;
    template: "REACT" | "NEXTJS" | "EXPRESS" | "VUE" | "HONO" | "ANGULAR";
    description?: string;
  })=>{
    const {template , title , description} = data;

    const user = await currentUser();
    if (!user?.id) {
      throw new Error("You must be signed in to create a playground");
    }

    try {
      const templatePath = templatePaths[template];
      if (!templatePath) {
        throw new Error(`Template not found: ${template}`);
      }

      const templateDirectory = path.join(
        /* turbopackIgnore: true */ process.cwd(),
        templatePath,
      );
      const templateData = await scanTemplateDirectory(templateDirectory);
        const playground = await db.playground.create({
        data: {
          title,
          description,
          template,
          userId:user.id,
          templateFiles: {
            create: {
              content: JSON.stringify(templateData),
            },
          },
        },
      });

        return playground;
    } catch (error) {
      console.error("Error creating playground:", error);
      throw new Error("Failed to create playground");
    }
}


export const getAllPlaygroundForUser = async ()=>{
    const user = await currentUser();
    try {
        const user  = await currentUser();
        const playground = await db.playground.findMany({
            where:{
                userId:user?.id!
            },
            include:{
                user:true,
                Starmark:{
                    where:{
                        userId:user?.id!
                    },
                    select:{
                        isMarked:true
                    }
                }
            }
        })

        return playground;
    } catch (error) {
        console.log(error)
    }
}

export const getPlaygroundById = async (id:string)=>{
    try {
        const playground = await db.playground.findUnique({
            where:{id},
            select:{
              templateFiles:{
                select:{
                  content:true
                }
              }
            }
        })
        return playground;
    } catch (error) {
        console.log(error)
    }
}

export const SaveUpdatedCode = async (playgroundId: string, data: TemplateFolder) => {
  const user = await currentUser();
  if (!user) return null;

  try {
    const updatedPlayground = await db.templateFile.upsert({
      where: {
        playgroundId, // now allowed since playgroundId is unique
      },
      update: {
        content: JSON.stringify(data),
      },
      create: {
        playgroundId,
        content: JSON.stringify(data),
      },
    });

    return updatedPlayground;
  } catch (error) {
    console.log("SaveUpdatedCode error:", error);
    return null;
  }
};

export const deleteProjectById = async (id:string)=>{
    try {
        await db.playground.delete({
            where:{id}
        })
        revalidatePath("/dashboard")
    } catch (error) {
        console.log(error)
    }
}


export const editProjectById = async (id:string,data:{title:string , description:string})=>{
    try {
        await db.playground.update({
            where:{id},
            data:data
        })
        revalidatePath("/dashboard")
    } catch (error) {
        console.log(error)
    }
}

export const duplicateProjectById = async (id: string) => {
    try {
        // Fetch the original playground data
        const originalPlayground = await db.playground.findUnique({
            where: { id },
            include: {
                templateFiles: true, // Include related template files
            },
        });

        if (!originalPlayground) {
            throw new Error("Original playground not found");
        }

        // Create a new playground with the same data but a new ID
        const duplicatedPlayground = await db.playground.create({
            data: {
                title: `${originalPlayground.title} (Copy)`,
                description: originalPlayground.description,
                template: originalPlayground.template,
                userId: originalPlayground.userId,
            },
        });

        // Create template files for duplicated playground
        await Promise.all(originalPlayground.templateFiles.map(async (file) => {
            await db.templateFile.create({
                data: {
                    playgroundId: duplicatedPlayground.id,
                    content: file.content as any,
                },
            });
        }));

        // Revalidate the dashboard path to reflect the changes
        revalidatePath("/dashboard");

        return duplicatedPlayground;
    } catch (error) {
        console.error("Error duplicating project:", error);
    }
};