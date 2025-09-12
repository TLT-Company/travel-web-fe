import { useEffect } from 'react';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.css';
import 'flatpickr/dist/plugins/monthSelect/style.css';
import monthSelectPlugin from 'flatpickr/dist/plugins/monthSelect';
import { Vietnamese } from "flatpickr/dist/l10n/vn.js";
import Label from './Label';
import { CalenderIcon } from '../../icons';
import Hook = flatpickr.Options.Hook;
import DateOption = flatpickr.Options.DateOption;

type PropsType = {
  id: string;
  mode?: "single" | "multiple" | "range" | "time";
  onChange?: Hook | Hook[];
  defaultDate?: DateOption;
  label?: string;
  placeholder?: string;
  monthSelectMode?: boolean;
};

export default function DatePicker({
  id,
  mode,
  onChange,
  label,
  defaultDate,
  placeholder,
  monthSelectMode = false,
}: PropsType) {
  // useEffect(() => {
  //   const options: flatpickr.Options.Options = {
  //     mode: mode || "single",
  //     static: true,
  //     monthSelectorType: "static",
  //     defaultDate,
  //     onChange,
  //     allowInput: true,
  //     locale: Vietnamese,
  //     onClose: (selectedDates, dateStr, instance) => {
  //       if (onChange) {
  //         const hooks = Array.isArray(onChange) ? onChange : [onChange];
  //         hooks.forEach(fn => fn(selectedDates, dateStr, instance));
  //       }
  //     },
  //   };

  //   // Nếu bật chế độ chọn tháng
  //   if (monthSelectMode) {
  //     options.dateFormat = "Y-m"; // YYYY-MM
  //     options.altInput = true;
  //     options.altFormat = "m-Y";
  //     options.plugins = [
  //       monthSelectPlugin({
  //         shorthand: true,
  //         dateFormat: "Y-m",
  //         altFormat: "F Y",
  //         theme: "light",
  //       }),
  //     ];
  //   } else {
  //     options.dateFormat = "Y-m-d";
  //     options.altInput = true;
  //     options.altFormat = "d/m/Y";
  //   }

  //   const flatPickr = flatpickr(`#${id}`, options);

  //   return () => {
  //     if (!Array.isArray(flatPickr)) {
  //       flatPickr.destroy();
  //     }
  //   };
  // }, [mode, onChange, id, defaultDate, monthSelectMode]);

  useEffect(() => {
    const options: flatpickr.Options.Options = {
      mode: mode || "single",
      static: true,
      monthSelectorType: "static",
      defaultDate,
      onChange,
      allowInput: true,
      locale: Vietnamese,
      onClose: (selectedDates, dateStr, instance) => {
        if (onChange) {
          const hooks = Array.isArray(onChange) ? onChange : [onChange];
          hooks.forEach(fn => fn(selectedDates, dateStr, instance));
        }
      },
      dateFormat: "Y-m-d",   // giá trị thực lưu
      altInput: true,
      altFormat: "d/m/Y",    // giá trị hiển thị
    };
  
    const fp = flatpickr(`#${id}`, options);
  
    if (!Array.isArray(fp) && fp.altInput) {
      const inputEl = fp.altInput as HTMLInputElement;
    
      // ✅ Xử lý nhập số
      inputEl.addEventListener("input", (e: any) => {
        let val = e.target.value.replace(/\D/g, ""); // chỉ giữ số
    
        if (val.length >= 2) {
          val = val.slice(0, 2) + "/" + val.slice(2);
        }
        if (val.length >= 5) {
          val = val.slice(0, 5) + "/" + val.slice(5, 9);
        }
    
        e.target.value = val;
    
        // Khi nhập đủ dd/mm/yyyy
        if (val.length === 10) {
          const [d, m, y] = val.split("/").map(Number);
          const parsed = new Date(y, m - 1, d);
    
          if (
            parsed.getFullYear() === y &&
            parsed.getMonth() === m - 1 &&
            parsed.getDate() === d
          ) {
            fp.setDate(parsed, true, "Y-m-d");
          }
        }
      });
    
      // ✅ Xử lý xoá lùi/backspace
      inputEl.addEventListener("keydown", (e: KeyboardEvent) => {
        if (e.key === "Backspace") {
          const pos = inputEl.selectionStart || 0;
          if (pos > 0 && inputEl.value[pos - 1] === "/") {
            e.preventDefault();
            const newPos = pos - 1;
            inputEl.value =
              inputEl.value.slice(0, pos - 1) + inputEl.value.slice(pos);
            inputEl.setSelectionRange(newPos, newPos);
          }
        }
      });
    }    
  
    return () => {
      if (!Array.isArray(fp)) {
        fp.destroy();
      }
    };
  }, [mode, onChange, id, defaultDate, monthSelectMode]);
  
  return (
    <div>
      {label && <Label htmlFor={id}>{label}</Label>}

      <div className="relative">
        <input
          id={id}
          placeholder={placeholder}
          className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3  dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30  bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700  dark:focus:border-brand-800"
        />

        <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
          <CalenderIcon className="size-6" />
        </span>
      </div>
    </div>
  );
}
