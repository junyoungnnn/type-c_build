import { atom } from "recoil";
import moment from "moment";

export const isDarkAtom = atom({
  key: "isDark",
  default: false,
});

export const endDateAtom = atom({
  key: "endDate1", // ������ Ű
  default: moment().format("YYYY-MM-DD"), // �ʱ� ��
});

export const startDateAtom = atom({
  key: "startDate",
  default: moment().subtract(7, "days").format("YYYY-MM-DD"),
});

export const oneMonthLastAtom = atom({
  key: "oneMonthLast",
  default: moment().subtract(1, "month").format("YYYY-MM-DD"),
});
