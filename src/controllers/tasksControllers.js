import Task from "../models/TasksModel.js";
import mongoose from "mongoose";


const getAllTasks = async (req, res) => {
  try {
    const userId = req.user.id;
    const tasks = await Task.find({ userId }).sort({ createdAt: -1 });
    res.status(200).json(tasks);
  } catch (error) {
    console.error(`[Tasks] Error al obtener tareas: ${error.message}`);
    res.status(500).json({ message: "Error al obtener tareas" });
  }
}

const addTask = async (req, res) => {
  try {
    const userId = req.user.id;
    const { text } = req.body;

    const cleanText = text?.trim();
    if (!cleanText) {
      return res.status(400).json({ message: "El texto de la tarea es obligatorio" });
    }

    const newTask = new Task({ text: cleanText, userId });
    await newTask.save();

    res.status(201).json(newTask);
  } catch (error) {
    console.error(`[Tasks] Error al crear tarea: ${error.message}`);
    res.status(500).json({ message: "Error al crear tarea" });
  }
}

const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID de tarea no válido" });
    }

    const task = await Task.findOne({ _id: id, userId });
    if (!task) {
      return res.status(404).json({ message: "Tarea no encontrada" });
    }

    task.completed = !task.completed;
    await task.save();

    res.status(200).json(task);
  } catch (error) {
    console.error(`[Tasks] Error al actualizar tarea: ${error.message}`);
    res.status(500).json({ message: "Error al actualizar tarea" });
  }
}

const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID de tarea no válido" });
    }

    const deletedTask = await Task.findOneAndDelete({ _id: id, userId });
    if (!deletedTask) {
      return res.status(404).json({ message: "Tarea no encontrada" });
    }

    res.status(200).json({ message: "Tarea eliminada correctamente" });
  } catch (error) {
    console.error(`[Tasks] Error al eliminar tarea: ${error.message}`);
    res.status(500).json({ message: "Error al eliminar tarea" });
  }
}

export default { getAllTasks, addTask, updateTask, deleteTask }