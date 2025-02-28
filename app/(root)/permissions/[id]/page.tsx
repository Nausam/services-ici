import { getPermissionRequestById } from "@/lib/actions/permissions.actions";
import React from "react";
import { Button } from "@/components/ui/button";
import { Calendar, Phone, Building, FileText } from "lucide-react";

type Props = {
  params: { id: string };
};

const PermissionRequestPage = async ({ params }: Props) => {
  const permissionRequest = await getPermissionRequestById(params.id);

  if (!permissionRequest) {
    return (
      <div className="text-center text-red-600 text-xl font-semibold mt-10">
        އެކުރި ހިދުމަތް ނުފެންނަމެއް!
      </div>
    );
  }

  return (
    <div
      dir="rtl"
      className="max-w-3xl mx-auto mt-10 p-8 bg-gradient-to-br from-white to-slate-50 shadow-xl rounded-2xl border border-white font-dhivehi"
    >
      <h2 className="text-3xl font-dhivehi text-center text-cyan-800 font-bold mb-6">
        ހުއްދަ ރިކުއެސްޓް
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-4 bg-white rounded-lg shadow-md">
          <p className="font-dhivehi text-xl text-right text-cyan-900 font-semibold">
            ނަން:
          </p>
          <p className="text-lg font-bold">{permissionRequest.fullName}</p>
        </div>

        <div className="p-4 bg-white rounded-lg shadow-md flex items-center gap-2">
          <Phone className="text-cyan-700" size={20} />
          <div>
            <p className="font-dhivehi text-xl text-right text-cyan-900 font-semibold">
              ފޯނު ނަންބަރު:
            </p>
            <p className="text-lg font-bold">
              {permissionRequest.contactNumber}
            </p>
          </div>
        </div>

        {permissionRequest.company && (
          <div className="p-4 bg-white rounded-lg shadow-md flex items-center gap-2">
            <Building className="text-cyan-700" size={20} />
            <div>
              <p className="font-dhivehi text-xl text-right text-cyan-900 font-semibold">
                ކޮމްޕަނީ / އޮގަނައިޒޭޝަން:
              </p>
              <p className="text-lg font-bold">{permissionRequest.company}</p>
            </div>
          </div>
        )}

        <div className="p-4 bg-white rounded-lg shadow-md flex items-center gap-2">
          <FileText className="text-cyan-700" size={20} />
          <div>
            <p className="font-dhivehi text-xl text-right text-cyan-900 font-semibold">
              ހުއްދަ:
            </p>
            <p className="text-lg font-bold">
              {permissionRequest.permissionType}
            </p>
          </div>
        </div>

        <div className="p-4 bg-white rounded-lg shadow-md">
          <p className="font-dhivehi text-xl text-right text-cyan-900 font-semibold">
            ސަބަބު:
          </p>
          <p className="text-lg font-bold">{permissionRequest.reason}</p>
        </div>

        <div className="p-4 bg-white rounded-lg shadow-md flex items-center gap-2">
          <Calendar className="text-cyan-700" size={20} />
          <div>
            <p className="font-dhivehi text-xl text-right text-cyan-900 font-semibold">
              ފަށާ ދުވަސް:{" "}
            </p>
            <p className="text-lg font-bold">
              {new Date(permissionRequest.startDate).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="p-4 bg-white rounded-lg shadow-md flex items-center gap-2">
          <Calendar className="text-red-500" size={20} />
          <div>
            <p className="font-dhivehi text-xl text-right text-cyan-900 font-semibold">
              ނިމޭ ދުވަސް:
            </p>
            <p className="text-lg font-bold">
              {new Date(permissionRequest.endDate).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex justify-end mt-6 gap-4">
        <Button className="bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-2 rounded-lg font-dhivehi">
          އުފައްދާ
        </Button>
        <Button className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-dhivehi">
          ކޮށްފި
        </Button>
      </div>
    </div>
  );
};

export default PermissionRequestPage;
