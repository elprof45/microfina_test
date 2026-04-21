"use client";

import React, { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { Card } from "@/components/Common";

export default function CarnetsPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Carnets (Notebooks)</h1>

      <Card className="text-center py-16">
        <p className="text-gray-600 text-lg">
          Carnets are managed through clients. View a client's detail page to see their associated carnets.
        </p>
        <p className="text-gray-500 text-sm mt-4">
          Navigate to <span className="font-medium">Clients</span> → Select a client → View their carnets
        </p>
      </Card>
    </div>
  );
}
