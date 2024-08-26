import { atom } from "recoil";
import moment from "moment";

export const isDarkAtom = atom({
  key: "isDark",
  default: false,
});

export const endDateAtom = atom({
  key: "endDate", // ������ Ű
  default: moment().format("YYYY-MM-DD"), // �ʱ� ��
});

export const oneWeekDateAtom = atom({
  key: "startDate",
  default: moment().subtract(7, "days").format("YYYY-MM-DD"),
});

export const oneMonthLastAtom = atom({
  key: "oneMonthLast",
  default: moment().subtract(1, "month").format("YYYY-MM-DD"),
});

export const halfYearLastAtom = atom({
  key: "halfYearLast",
  default: moment().subtract(6, "month").format("YYYY-MM-DD"),
});
