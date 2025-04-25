import React, { useState, useEffect } from "react";
import { User } from "lucide-react";
import { Participant, Photo } from "../types";
import Button from "./Button";
import { X } from "lucide-react";

interface ManualAssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  participants: Participant[];
  photos: Photo[];
  onAssign: (participantId: string, photoId: string) => void;
  onUnassign: (participantId: string) => void;
}

const ManualAssignmentModal: React.FC<ManualAssignmentModalProps> = ({
  isOpen,
  onClose,
  participants,
  photos,
  onAssign,
  onUnassign,
}) => {
  const [selectedParticipant, setSelectedParticipant] = useState<string | null>(
    null
  );
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [unassignedPhotos, setUnassignedPhotos] = useState<Photo[]>([]);

  // Sort participants alphabetically by name
  const sortedParticipants = [...participants].sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  // Update unassigned photos whenever photos or participants change
  useEffect(() => {
    // Get all photo IDs that are currently assigned
    const assignedPhotoIds = new Set(
      participants
        .filter((p) => p.photo_assigned !== null)
        .map((p) => p.photo_assigned as string)
    );

    // Filter out assigned photos and ensure they have IDs
    const unassigned = photos.filter(
      (photo) => photo.id && !assignedPhotoIds.has(photo.id)
    );
    setUnassignedPhotos(unassigned);
  }, [photos, participants]);

  const handleParticipantClick = (participantId: string) => {
    const participant = participants.find((p) => p.id === participantId);

    if (selectedParticipant === participantId) {
      // If clicking the same participant again, unassign their photo
      if (participant?.photo_assigned) {
        onUnassign(participantId);
        setSelectedParticipant(null);
        setSelectedPhoto(null);
      }
    } else {
      // Select the participant for assignment
      setSelectedParticipant(participantId);
      setSelectedPhoto(null);
    }
  };

  const handlePhotoClick = (photoId: string) => {
    setSelectedPhoto(photoId);
  };

  const handleConfirmAssignment = () => {
    if (selectedParticipant && selectedPhoto) {
      onAssign(selectedParticipant, selectedPhoto);
      setSelectedParticipant(null);
      setSelectedPhoto(null);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Manual Photo Assignment</h2>
            <Button variant="text" onClick={onClose} icon={<X size={20} />}>
              Close
            </Button>
          </div>

          {/* Participants Section */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">Select Participant</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {sortedParticipants.map((participant) => {
                const assignedPhoto = participant.photo_assigned
                  ? photos.find(
                      (photo) => photo.id === participant.photo_assigned
                    )
                  : null;

                return (
                  <div
                    key={participant.id}
                    onClick={() => handleParticipantClick(participant.id)}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all
                      ${
                        selectedParticipant === participant.id
                          ? assignedPhoto
                            ? "border-red-500 bg-red-50"
                            : "border-indigo-500 bg-indigo-50"
                          : "border-gray-200 hover:border-indigo-300"
                      }`}
                  >
                    <div className="flex items-center space-x-3">
                      {assignedPhoto ? (
                        <img
                          src={assignedPhoto.url}
                          alt="Assigned photo"
                          className="w-12 h-12 rounded-full object-cover border border-gray-200"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                          <User className="w-6 h-6 text-gray-400" />
                        </div>
                      )}
                      <div>
                        <p className="font-medium">{participant.name}</p>
                        <p className="text-sm text-gray-500">
                          {assignedPhoto ? "Photo assigned" : "No photo"}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Photos Section */}
          <div>
            <h3 className="text-lg font-semibold mb-3">
              {selectedParticipant
                ? participants.find((p) => p.id === selectedParticipant)
                    ?.photo_assigned
                  ? "Click again to unassign photo"
                  : "Select Photo to Assign"
                : "Click on a participant first"}
            </h3>
            {unassignedPhotos.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No unassigned photos available
              </div>
            ) : (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
                {unassignedPhotos.map((photo) => (
                  <div
                    key={photo.id}
                    onClick={() => photo.id && handlePhotoClick(photo.id)}
                    className={`relative aspect-square rounded-lg overflow-hidden cursor-pointer
                      ${
                        selectedPhoto === photo.id
                          ? "ring-2 ring-indigo-500"
                          : selectedParticipant
                          ? "hover:ring-2 hover:ring-indigo-500"
                          : "opacity-50"
                      }`}
                  >
                    <img
                      src={photo.url}
                      alt={photo.title || "Photo"}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Confirmation Button */}
          <div className="mt-6 flex justify-end">
            <Button
              onClick={handleConfirmAssignment}
              disabled={!selectedParticipant || !selectedPhoto}
              className="bg-indigo-500 hover:bg-indigo-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Confirm
            </Button>
          </div>

          {/* Instructions */}
          {selectedParticipant && (
            <div className="mt-4 p-3 bg-indigo-50 rounded-lg text-indigo-700">
              <p>
                {participants.find((p) => p.id === selectedParticipant)
                  ?.photo_assigned
                  ? "Click the participant again to unassign their photo"
                  : selectedPhoto
                  ? "Click Confirm Assignment to assign the selected photo"
                  : "Click on a photo to assign it to the selected participant"}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManualAssignmentModal;
