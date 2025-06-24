
import { Request, Response } from 'express';
import { prisma } from '../../lib/prisma'


export const createVerification = async (req: Request, res: Response) => {
  try {
    const { postId, modderId, statusVerification, reasonAnswer } = req.body;

    const verification = await prisma.verification.create({
      data: {
        post: { connect: { id: postId } },
        modder: { connect: { id: modderId } },
        date: new Date(),
        statusVerification,
        reasonAnswer,
      },
      include: {
        post: true,
        modder: true,
      },
    });

    res.status(201).json(verification);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating verification' });
  }
};

export const getAllVerifications = async (_req: Request, res: Response) => {
  try {
    const verifications = await prisma.verification.findMany({
      include: {
        post: true,
        modder: true,
      },
    });

    res.json(verifications);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching verifications' });
  }
};

export const getVerificationById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const verification = await prisma.verification.findUnique({
      where: { id: Number(id) },
      include: {
        post: true,
        modder: true,
      },
    });

    if (!verification) {
      res.status(404).json({ message: 'Verification not found' });
      return 
    }

    res.json(verification);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching verification' });
  }
};

export const updateVerification = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { statusVerification, reasonAnswer } = req.body;

    const updated = await prisma.verification.update({
      where: { id: Number(id) },
      data: {
        statusVerification,
        reasonAnswer,
      },
    });

    res.json(updated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating verification' });
  }
};

export const deleteVerification = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.verification.delete({
      where: { id: Number(id) },
    });

    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting verification' });
  }
};
