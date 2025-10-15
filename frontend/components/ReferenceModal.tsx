'use client';

import { X, ExternalLink } from 'lucide-react';

interface ReferenceModalProps {
  reference: any;
  isOpen: boolean;
  onClose: () => void;
}

export function ReferenceModal({ reference, isOpen, onClose }: ReferenceModalProps) {
  if (!isOpen) return null;

  const handleExternalClick = () => {
    if (reference.externalUrl) {
      window.open(reference.externalUrl, '_blank');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={onClose}
        />

        {/* Modal */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-6 pt-6 pb-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                Référence
              </h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="mb-4">
              <p className="text-gray-700 mb-2">
                {reference.referenceText}
              </p>
              {reference.referenceType && (
                <p className="text-sm text-gray-500">
                  Type: {reference.referenceType}
                </p>
              )}
              {reference.targetArticleNumber && (
                <p className="text-sm text-gray-500">
                  Article cible: {reference.targetArticleNumber}
                </p>
              )}
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={onClose}
                className="btn btn-ghost"
              >
                Fermer
              </button>
              {reference.externalUrl && (
                <button
                  onClick={handleExternalClick}
                  className="btn btn-primary"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Ouvrir
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}