import { ValidationErrorsIBAN } from 'ibantools';

export { getFriendlyErrors };
export type IbanFriendlyErrorKey =
  | 'noIbanProvided'
  | 'noIbanCountry'
  | 'wrongBbanLength'
  | 'wrongBbanFormat'
  | 'checksumNotNumber'
  | 'wrongIbanChecksum'
  | 'wrongAccountBankBranchChecksum'
  | 'qrIbanNotAllowed';

const ibanErrorToKey: Partial<Record<ValidationErrorsIBAN, IbanFriendlyErrorKey>> = {
  [ValidationErrorsIBAN.NoIBANProvided]: 'noIbanProvided',
  [ValidationErrorsIBAN.NoIBANCountry]: 'noIbanCountry',
  [ValidationErrorsIBAN.WrongBBANLength]: 'wrongBbanLength',
  [ValidationErrorsIBAN.WrongBBANFormat]: 'wrongBbanFormat',
  [ValidationErrorsIBAN.ChecksumNotNumber]: 'checksumNotNumber',
  [ValidationErrorsIBAN.WrongIBANChecksum]: 'wrongIbanChecksum',
  [ValidationErrorsIBAN.WrongAccountBankBranchChecksum]: 'wrongAccountBankBranchChecksum',
  [ValidationErrorsIBAN.QRIBANNotAllowed]: 'qrIbanNotAllowed',
};

function getFriendlyErrors(errorCodes: ValidationErrorsIBAN[]): IbanFriendlyErrorKey[] {
  return errorCodes.map(errorCode => ibanErrorToKey[errorCode]).filter(Boolean) as IbanFriendlyErrorKey[];
}
