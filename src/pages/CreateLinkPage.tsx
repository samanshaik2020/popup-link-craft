
import React from "react";
import LinkForm from "@/components/LinkForm";
import { createLink } from "@/services/linkService";

const CreateLinkPage: React.FC = () => {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Create Popup Link</h1>
        <LinkForm onSubmit={createLink} />
      </div>
    </div>
  );
};

export default CreateLinkPage;
