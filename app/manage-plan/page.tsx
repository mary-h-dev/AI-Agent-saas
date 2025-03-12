import SchematicComponent from "@/components/schematic/SchematicComponent";

function ManagePlan() {
  return (
    <div className="bg-black min-h-screen">
      <div className="container mx-auto p-4 md:p-0">
        <h1 className="text-2xl font-bold mb-4 text-blue-600 py-4">Manage Your Plan</h1>
        <p className="text-blue-600 mb-8">
          Manage your subscription and billing details here.
        </p> 
        <SchematicComponent componentId="cmpn_8o9ecb1Kr3b" />
      </div>
    </div>
  );
}

export default ManagePlan;
