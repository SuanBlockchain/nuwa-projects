import bcrypt from "bcryptjs";
import type { User } from '@/app/lib/definitions';

import { prisma } from '@/prisma';

import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

import blueprint from "@/contracts/plutus.json" assert { type: "json" };
import {  getLucidWasmBindings } from "@/app/lib/lucid-client";
import type {
  MintingPolicy,
  OutRef,
  SpendingValidator
} from "@/app/lib/lucid-client";

// import {
//   applyDoubleCborEncoding,
//   applyParamsToScript,
//   Constr,
//   fromText,
//   validatorToAddress,
//   validatorToScriptHash,
//   type MintingPolicy,
//   type OutRef,
//   type SpendingValidator,
// } from "@lucid-evolution/lucid";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatCurrency = (amount: number) => {
  return (amount / 100).toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
  });
};

export const formatDateToLocal = (
  dateStr: string,
  locale: string = 'en-US',
) => {
  const date = new Date(dateStr);
  const options: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  };
  const formatter = new Intl.DateTimeFormat(locale, options);
  return formatter.format(date);
};

export const generatePagination = (currentPage: number, totalPages: number) => {
  // If the total number of pages is 7 or less,
  // display all pages without any ellipsis.
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  // If the current page is among the first 3 pages,
  // show the first 3, an ellipsis, and the last 2 pages.
  if (currentPage <= 3) {
    return [1, 2, 3, '...', totalPages - 1, totalPages];
  }

  // If the current page is among the last 3 pages,
  // show the first 2, an ellipsis, and the last 3 pages.
  if (currentPage >= totalPages - 2) {
    return [1, 2, '...', totalPages - 2, totalPages - 1, totalPages];
  }

  // If the current page is somewhere in the middle,
  // show the first page, an ellipsis, the current page and its neighbors,
  // another ellipsis, and the last page.
  return [
    1,
    '...',
    currentPage - 1,
    currentPage,
    currentPage + 1,
    '...',
    totalPages,
  ];
};

export const saltAndHashPassword = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, 10);
};

export async function getUser(email: string): Promise<User | undefined> {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });
    if (user) {
      return { ...user, name: user.name ?? '' };
    }
    return undefined;
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw new Error('Failed to fetch user.');
  }
}

 
export type Validators = {
  giftCard: string;
};
 
export function readValidators(): Validators {

  const giftCard = blueprint.validators.find(
    (v) => v.title === "oneshot.gift_card.spend"
  );

  if (!giftCard) {
    throw new Error("Gift Card validator not found. Please check the structure of the plutus.json file.");
  }

  return {
    giftCard: giftCard.compiledCode,
  };
}

export type AppliedValidators = {
  redeem: SpendingValidator;
  giftCard: MintingPolicy;
  policyId: string;
  lockAddress: string;
};
 
export async function applyParams(
  tokenName: string,
  outputReference: OutRef,
  validator: string
): Promise<AppliedValidators> {

  const lucidWasm = await getLucidWasmBindings();
  // const { 
  //   applyDoubleCborEncoding,
  //   applyParamsToScript,
  //   // fromText,
  //   validatorToAddress,
  //   validatorToScriptHash
  // } = getLucidUtils();

  const outRef = new lucidWasm.Constr(0, [
    outputReference.txHash,
    BigInt(outputReference.outputIndex),
  ]);
 
  const giftCard = lucidWasm.applyParamsToScript(validator, [
    lucidWasm.fromText(tokenName),
    outRef,
  ]);
 
  const policyId = lucidWasm.validatorToScriptHash({
    type: "PlutusV3",
    script: giftCard,
  });
 
  const lockAddress = lucidWasm.validatorToAddress("Preview", {
    type: "PlutusV3",
    script: giftCard,
  });
 
  return {
    redeem: { type: "PlutusV3", script: lucidWasm.applyDoubleCborEncoding(giftCard) },
    giftCard: { type: "PlutusV3", script: lucidWasm.applyDoubleCborEncoding(giftCard) },
    policyId,
    lockAddress,
  };
}

