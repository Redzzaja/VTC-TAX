"use server";

import { query } from "@/lib/db";
import { revalidatePath } from "next/cache";

export type Material = {
  id: number;
  title: string;
  description: string;
  category: string;
  type: string;
  url: string;
  created_at: Date;
};

export async function getMateriListAction() {
  try {
    const res = await query("SELECT * FROM materials ORDER BY created_at DESC");
    return { success: true, data: res.rows as Material[] };
  } catch (error) {
    console.error("Error fetching materials:", error);
    return { success: false, data: [] };
  }
}

export async function addMaterialAction(prevState: any, formData: FormData) {
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const category = formData.get("category") as string;
  const type = formData.get("type") as string;
  const url = formData.get("url") as string;

  if (!title || !url) {
    return { success: false, message: "Judul dan URL wajib diisi." };
  }

  try {
    await query(
      `INSERT INTO materials (title, description, category, type, url) 
       VALUES ($1, $2, $3, $4, $5)`,
      [title, description, category, type, url]
    );
    revalidatePath("/dashboard/materi");
    revalidatePath("/dashboard/admin/materials");
    return { success: true, message: "Materi berhasil ditambahkan." };
  } catch (error) {
    console.error("Error adding material:", error);
    return { success: false, message: "Gagal menambahkan materi." };
  }
}

export async function deleteMaterialAction(id: number) {
  try {
    await query("DELETE FROM materials WHERE id = $1", [id]);
    revalidatePath("/dashboard/materi");
    revalidatePath("/dashboard/admin/materials");
    return { success: true, message: "Materi berhasil dihapus." };
  } catch (error) {
    console.error("Error deleting material:", error);
    return { success: false, message: "Gagal menghapus materi." };
  }
}
