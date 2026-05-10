import { notFound } from "next/navigation";

import { RecordManager } from "@/components/admin/record-manager";
import { recordModuleLabels } from "@/config/admin";
import { assertAdminRecordModule, listAdminRecords } from "@/lib/admin-records";

type PageProps = {
  params: {
    module: string;
  };
};

export default async function AdminRecordModulePage({ params }: PageProps) {
  if (!(params.module in recordModuleLabels)) {
    notFound();
  }

  assertAdminRecordModule(params.module);

  return (
    <RecordManager
      module={params.module}
      title={recordModuleLabels[params.module]}
      initialRecords={await listAdminRecords(params.module)}
    />
  );
}
