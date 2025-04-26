// --- services ---
import accountService from "../services/accountService.js";

// --- utils ---

// --- Account controller ---
/*
   - get account
   - update account
   - delete account
*/

const getAccount = (req, res, next) => {
  const account = accountService.getAccount(req, res, next);
  res.status(200).json(account);
};

const updateAccount = (req, res, next) => {
  const account = accountService.updateAccount(req, res, next);
  res.status(200).json(account);
};

const deleteAccount = (req, res, next) => {
  const account = accountService.deleteAccount(req, res, next);
  res.status(200).json(account);
};

// --- export ---
export default { getAccount, updateAccount, deleteAccount };
