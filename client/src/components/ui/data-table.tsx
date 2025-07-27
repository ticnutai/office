import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit } from "lucide-react";
import { DashboardItem } from "@shared/schema";

interface DataTableProps {
  data: DashboardItem[];
  onEdit?: (item: DashboardItem) => void;
}

const getStatusVariant = (status: string) => {
  switch (status) {
    case "הושלם":
      return "default";
    case "בטיפול":
      return "secondary";
    case "נדרש טיפול":
      return "destructive";
    case "בביקורת":
      return "outline";
    default:
      return "secondary";
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "הושלם":
      return "bg-green-100 text-green-800";
    case "בטיפול":
      return "bg-yellow-100 text-yellow-800";
    case "נדרש טיפול":
      return "bg-red-100 text-red-800";
    case "בביקורת":
      return "bg-blue-100 text-blue-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export function DataTable({ data, onEdit }: DataTableProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-blue-50 border-b border-gray-200">
            <TableRow>
              <TableHead className="px-6 py-4 text-right text-sm font-semibold text-gray-900 border-l border-gray-200">
                אתר
              </TableHead>
              <TableHead className="px-6 py-4 text-right text-sm font-semibold text-gray-900 border-l border-gray-200">
                סטטוס
              </TableHead>
              <TableHead className="px-6 py-4 text-right text-sm font-semibold text-gray-900 border-l border-gray-200">
                תאריך קורא
              </TableHead>
              <TableHead className="px-6 py-4 text-right text-sm font-semibold text-gray-900 border-l border-gray-200">
                שם הקשובה
              </TableHead>
              <TableHead className="px-6 py-4 text-right text-sm font-semibold text-gray-900 border-l border-gray-200">
                שם הלקוח
              </TableHead>
              <TableHead className="px-6 py-4 text-right text-sm font-semibold text-gray-900">
                פעולה
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-gray-200">
            {data.map((item) => (
              <TableRow key={item.id} className="hover:bg-gray-50 transition-colors duration-150">
                <TableCell className="px-6 py-4 text-sm text-gray-900 border-l border-gray-200 text-right">
                  {item.site}
                </TableCell>
                <TableCell className="px-6 py-4 text-sm border-l border-gray-200">
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(item.status)}`}>
                    {item.status}
                  </span>
                </TableCell>
                <TableCell className="px-6 py-4 text-sm text-gray-900 border-l border-gray-200 text-right">
                  {item.date}
                </TableCell>
                <TableCell className="px-6 py-4 text-sm text-gray-900 border-l border-gray-200 text-right">
                  {item.contactName}
                </TableCell>
                <TableCell className="px-6 py-4 text-sm text-gray-900 border-l border-gray-200 text-right">
                  {item.clientName}
                </TableCell>
                <TableCell className="px-6 py-4 text-sm">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit?.(item)}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    <Edit className="h-4 w-4 ml-1" />
                    עריכה
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
