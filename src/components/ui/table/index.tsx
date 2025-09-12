import React, { ReactNode } from "react";

// Props for Table
interface TableProps extends React.HTMLAttributes<HTMLTableElement> {
  children: ReactNode;
}

// Props for TableHeader
interface TableHeaderProps
  extends React.HTMLAttributes<HTMLTableSectionElement> {
  children: ReactNode;
}

// Props for TableBody
interface TableBodyProps
  extends React.HTMLAttributes<HTMLTableSectionElement> {
  children: ReactNode;
}

// Props for TableRow
interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  children: ReactNode;
}

// Props for TableCell
interface TableCellProps
  extends React.TdHTMLAttributes<HTMLTableCellElement> {
  children: ReactNode;
  isHeader?: boolean;
  colSpan?: number;
  rowSpan?: number;
}

// ✅ Table
const Table = React.forwardRef<HTMLTableElement, TableProps>(
  ({ children, className, ...props }, ref) => (
    <table ref={ref} className={`min-w-full ${className || ""}`} {...props}>
      {children}
    </table>
  )
);
Table.displayName = "Table";

// ✅ TableHeader
const TableHeader = React.forwardRef<HTMLTableSectionElement, TableHeaderProps>(
  ({ children, className, ...props }, ref) => (
    <thead ref={ref} className={className} {...props}>
      {children}
    </thead>
  )
);
TableHeader.displayName = "TableHeader";

// ✅ TableBody
const TableBody = React.forwardRef<HTMLTableSectionElement, TableBodyProps>(
  ({ children, className, ...props }, ref) => (
    <tbody ref={ref} className={className} {...props}>
      {children}
    </tbody>
  )
);
TableBody.displayName = "TableBody";

// ✅ TableRow
const TableRow = React.forwardRef<HTMLTableRowElement, TableRowProps>(
  ({ children, className, ...props }, ref) => (
    <tr ref={ref} className={className} {...props}>
      {children}
    </tr>
  )
);
TableRow.displayName = "TableRow";

// ✅ TableCell
const TableCell = React.forwardRef<
  HTMLTableCellElement,
  TableCellProps
>(({ children, isHeader = false, className, colSpan, rowSpan, ...props }, ref) => {
  const CellTag = isHeader ? "th" : "td";
  return (
    <CellTag
      ref={ref as any}
      className={className}
      colSpan={colSpan}
      rowSpan={rowSpan}
      {...props}
    >
      {children}
    </CellTag>
  );
});
TableCell.displayName = "TableCell";

export { Table, TableHeader, TableBody, TableRow, TableCell };
