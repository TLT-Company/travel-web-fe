"use client";

import React, { FC, useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Checkbox from "@/components/form/input/Checkbox";
import { format } from "date-fns";
import Link from "next/link";
import Button from "@/components/ui/button/Button";
import { PencilIcon, TrashBinIcon  } from "@/icons";
import { DocumentCustomer, updateDocumentCustomersOrder } from "@/services/documentCustomer.service";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface CustomerProps {
  documentCustomers: DocumentCustomer[];
  visibleCustomers: DocumentCustomer[];
  document_id: string;
  loading: boolean;
  onSubmitDelete: (customerId: string) => void;
  selectedCustomers: string[];
  onChangeSelectedCustomers: (selected: string[]) => void;
  onReorderCustomers?: (reorderedCustomers: DocumentCustomer[]) => void;
}

interface SortableRowProps {
  documentCustomer: DocumentCustomer;
  document_id: string;
  selectedCustomers: string[];
  loading: boolean;
  onSubmitDelete: (customerId: string) => void;
  toggleSelectCustomer: (id: string) => void;
}

// SortableRow component
const SortableRow: FC<SortableRowProps> = ({
  documentCustomer,
  document_id,
  selectedCustomers,
  loading,
  onSubmitDelete,
  toggleSelectCustomer,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: documentCustomer.customer.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <tr ref={setNodeRef} style={style} className={`${isDragging ? 'z-50' : ''}`}>
      <TableCell className="px-4 py-3">
        <div className="flex items-center gap-2">
          <div
            {...attributes}
            {...listeners}
            className="cursor-grab hover:cursor-grabbing p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
            title="Kéo để sắp xếp lại"
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
            >
              <path
                d="M2 3h8M2 6h8M2 9h8"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <Checkbox 
            checked={selectedCustomers?.includes(documentCustomer.customer.id)} 
            onChange={() => toggleSelectCustomer(documentCustomer.customer.id)} 
          />
        </div>
      </TableCell>

      <TableCell
        className="px-4 py-3 text-start text-theme-sm
                  dark:text-gray-400"
      >
        {documentCustomer.file_name || ''}
      </TableCell>
      <TableCell
        className="px-4 py-3 text-start text-theme-sm
                  dark:text-gray-400"
      >
        {documentCustomer.customer.card_id}
      </TableCell>
      <TableCell
        className="px-4 py-3 text-start text-theme-sm
                  dark:text-gray-400"
      >
        {documentCustomer.customer.full_name}
      </TableCell>
      <TableCell
        className="px-4 py-3 text-start text-theme-sm
                  dark:text-gray-400"
      >
        {format(new Date(documentCustomer.customer.day_of_birth), 'dd/MM/yyyy')}
      </TableCell>
      <TableCell
        className="px-4 py-3 text-start text-theme-sm
                  dark:text-gray-400"
      >
        {documentCustomer.customer.gender}
      </TableCell>
      <TableCell
        className="px-4 py-3 text-start text-theme-sm
                  dark:text-gray-400"
      >
        {documentCustomer.customer.national}
      </TableCell>
      <TableCell
        className="px-4 py-3 text-start text-theme-sm
                  dark:text-gray-400"
      >
        {format(new Date(documentCustomer.customer.card_created_at), 'dd/MM/yyyy')}
      </TableCell>
      <TableCell
        className="px-4 py-3 text-start text-theme-sm
                  dark:text-gray-400"
      >
        {documentCustomer.customer.village}
      </TableCell>
      <TableCell
        className="px-4 py-3 text-start text-theme-sm
                  dark:text-gray-400"
      >
        {documentCustomer.customer.address_mapping?.commune_new}
      </TableCell>
      <TableCell
        className="px-4 py-3 text-start text-theme-sm
                  dark:text-gray-400"
      >
        {documentCustomer.customer.address_mapping?.province_new}
      </TableCell>
      <TableCell
        className="px-4 py-3 text-start text-theme-sm
                  dark:text-gray-400"
      >
        <div className="flex items-center gap-2">
          <Link href={`/admin/thong-hanh/${document_id}/customer/edit/${documentCustomer.customer.id}`} passHref>
            <Button
              size="sm"
              className="bg-gray-500 hover:bg-gray-600"
              disabled={loading}
            >
              <PencilIcon className="w-6 h-6" />
            </Button>
          </Link>
          <Button
            size="sm"
            className="bg-red-500 hover:bg-blue-400"
            onClick={() => onSubmitDelete(documentCustomer.customer.id)}
            disabled={loading}
          >
            <TrashBinIcon className="w-6 h-6" />
          </Button>
        </div>
      </TableCell>
    </tr>
  );
};

const CustomerTable: FC<CustomerProps> = ({ 
  documentCustomers,
  visibleCustomers,
  loading,
  document_id,
  onSubmitDelete,
  selectedCustomers,
  onChangeSelectedCustomers,
  onReorderCustomers
  }) => {
  const [localCustomers, setLocalCustomers] = useState<DocumentCustomer[]>([]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    setLocalCustomers(visibleCustomers);
  }, [visibleCustomers]);

  useEffect(() => {
      const initiallySelected = documentCustomers
        .filter(c => c.print_flag === "1")
        .map(c => c.customer.id);
      onChangeSelectedCustomers(initiallySelected);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [documentCustomers]);

  const toggleSelectAll = () => {
    if (selectedCustomers.length === documentCustomers.length) {
      onChangeSelectedCustomers([]);
    } else {
      onChangeSelectedCustomers(documentCustomers.map(c => c.customer.id));
    }
  };

  const toggleSelectCustomer = (id: string) => {
    if (selectedCustomers.includes(id)) {
      onChangeSelectedCustomers(selectedCustomers.filter(cid => cid !== id));
    } else {
      onChangeSelectedCustomers([...selectedCustomers, id]);
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = localCustomers.findIndex(customer => customer.customer.id === active.id);
      const newIndex = localCustomers.findIndex(customer => customer.customer.id === over?.id);

      const newCustomers = arrayMove(localCustomers, oldIndex, newIndex);
      
      // Update display_order for all customers based on new order
      const customersWithUpdatedOrder = newCustomers.map((customer, index) => ({
        ...customer,
        display_order: index + 1
      }));

      setLocalCustomers(customersWithUpdatedOrder);

      // Call parent callback if provided
      if (onReorderCustomers) {
        onReorderCustomers(customersWithUpdatedOrder);
      }

      // Update all customers order on server
      try {
        await updateDocumentCustomersOrder(document_id, customersWithUpdatedOrder);
      } catch (error) {
        console.error('Failed to update customers order:', error);
        // Revert on error
        setLocalCustomers(localCustomers);
        if (onReorderCustomers) {
          onReorderCustomers(localCustomers);
        }
      }
    }
  };

  
  return (
    <div
      className="overflow-hidden rounded-xl border border-gray-200 bg-white
                dark:border-white/[0.05] dark:bg-white/[0.03]"
    >
      <div className="w-full overflow-x-auto">
        <div className="min-w-[1102px]">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <Table>
              <TableHeader
                className="border-b border-gray-100 dark:border-white/[0.05]"
              >
                <TableRow>
                  <TableCell isHeader className="px-5 py-3">
                    <Checkbox 
                    checked={selectedCustomers?.length === documentCustomers.length && documentCustomers.length > 0} 
                    onChange={toggleSelectAll}
                    />
                  </TableCell>
                  {[
                    "Tên file",
                    "ID thẻ",
                    "Họ và tên",
                    "Ngày sinh",
                    "Giới tính",
                    "Quốc tịch",
                    "Ngày làm thẻ",
                    "Địa chỉ",
                    "Xã",
                    // "Huyện",
                    "Tỉnh",
                    "..."
                  ].map((title, index) => (
                    <TableCell
                      key={index}
                      isHeader
                      className="px-5 py-3 font-medium text-gray-500 text-start
                                text-theme-xs dark:text-gray-400"
                    >
                      {title}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHeader>

              <TableBody
                className="divide-y divide-gray-100 dark:divide-white/[0.05]"
              >
                {localCustomers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={12} className="px-5 py-4 text-center">
                      Không có khách hàng nào
                    </TableCell>
                  </TableRow>
                ) : (
                  <SortableContext
                    items={localCustomers.map(customer => customer.customer.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    {localCustomers.map((documentCustomer) => (
                      <SortableRow
                        key={documentCustomer.customer.id}
                        documentCustomer={documentCustomer}
                        document_id={document_id}
                        selectedCustomers={selectedCustomers}
                        loading={loading}
                        onSubmitDelete={onSubmitDelete}
                        toggleSelectCustomer={toggleSelectCustomer}
                      />
                    ))}
                  </SortableContext>
                )}
              </TableBody>
            </Table>
          </DndContext>
        </div>
      </div>
    </div>
  );
};

export default CustomerTable;
