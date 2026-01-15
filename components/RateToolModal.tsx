'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { RatingInput, Rating } from '@/lib/types';
import RatingStars from './RatingStars';
import { generateFingerprint, hashFingerprint } from '@/lib/utils';

interface RateToolModalProps {
  toolName: string;
  toolId: string;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (rating: RatingInput) => Promise<void>;
}

export default function RateToolModal({
  toolName,
  toolId,
  isOpen,
  onClose,
  onSubmit,
}: RateToolModalProps) {
  const [rating, setRating] = useState(0);
  const [goodForCreators, setGoodForCreators] = useState(false);
  const [worthMoney, setWorthMoney] = useState(false);
  const [easyToUse, setEasyToUse] = useState(false);
  const [accurate, setAccurate] = useState(false);
  const [reliable, setReliable] = useState(false);
  const [beginnerFriendly, setBeginnerFriendly] = useState(false);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingExisting, setLoadingExisting] = useState(false);

  // Load existing rating when modal opens
  useEffect(() => {
    if (isOpen && toolId) {
      loadExistingRating();
    } else {
      // Reset form when modal closes
      setRating(0);
      setGoodForCreators(false);
      setWorthMoney(false);
      setEasyToUse(false);
      setAccurate(false);
      setReliable(false);
      setBeginnerFriendly(false);
      setComment('');
    }
  }, [isOpen, toolId]);

  const loadExistingRating = async () => {
    setLoadingExisting(true);
    try {
      console.log('[RateToolModal] Loading existing rating for tool:', toolId);
      
      const fingerprint = generateFingerprint();
      if (!fingerprint) {
        console.log('[RateToolModal] No fingerprint generated');
        return;
      }
      
      const fingerprintHash = await hashFingerprint(fingerprint);
      console.log('[RateToolModal] Fetching rating with fingerprint hash:', fingerprintHash.substring(0, 10) + '...');
      
      const response = await fetch(`/api/ratings?tool_id=${toolId}&fingerprint_hash=${fingerprintHash}`);
      console.log('[RateToolModal] Response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('[RateToolModal] Response data:', data);
        
        if (data.rating) {
          console.log('[RateToolModal] Found existing rating:', {
            stars: data.rating.stars,
            comment: data.rating.comment,
            good_for_creators: data.rating.good_for_creators,
            worth_money: data.rating.worth_money
          });
          
          // Load existing rating into form
          setRating(data.rating.stars);
          setGoodForCreators(data.rating.good_for_creators || false);
          setWorthMoney(data.rating.worth_money || false);
          setEasyToUse(data.rating.easy_to_use || false);
          setAccurate(data.rating.accurate || false);
          setReliable(data.rating.reliable || false);
          setBeginnerFriendly(data.rating.beginner_friendly || false);
          setComment(data.rating.comment || '');
        } else {
          console.log('[RateToolModal] No existing rating found');
        }
      } else {
        const errorData = await response.json();
        console.error('[RateToolModal] Error response:', errorData);
      }
    } catch (error) {
      console.error('[RateToolModal] Error loading existing rating:', error);
    } finally {
      setLoadingExisting(false);
    }
  };

  if (!isOpen) {
    console.log('RateToolModal: Not open, returning null');
    return null;
  }
  
  console.log('RateToolModal: Rendering modal for', toolName);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('RateToolModal: Form submitted');
    
    if (rating === 0) {
      alert('Please select a rating');
      return;
    }

    setIsSubmitting(true);
    try {
      console.log('RateToolModal: Calling onSubmit with rating:', rating);
      
      await onSubmit({
        stars: rating,
        good_for_creators: goodForCreators,
        works_in_hebrew: false,
        worth_money: worthMoney,
        easy_to_use: easyToUse,
        accurate: accurate,
        reliable: reliable,
        beginner_friendly: beginnerFriendly,
        comment: comment.trim() || undefined,
      });
      
      console.log('RateToolModal: Rating submitted successfully');
      
      // Don't reset form - keep values in case user wants to edit again
      onClose();
    } catch (error) {
      console.error('RateToolModal: Error submitting rating:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to submit rating. Please try again.';
      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-2xl font-bold mb-2">
          {rating > 0 ? 'Edit Your Review' : 'Rate'} {toolName}
        </h2>
        <p className="text-gray-600 mb-6">
          {rating > 0 ? 'Update your review for this tool' : 'Share your experience with this tool'}
        </p>

        {loadingExisting && (
          <div className="mb-6 text-center text-gray-500">
            Loading your existing review...
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rating
            </label>
            <RatingStars
              rating={rating}
              size="lg"
              interactive={true}
              onRatingChange={setRating}
            />
          </div>

          <div className="space-y-3 mb-6">
            <div className="grid grid-cols-2 gap-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={goodForCreators}
                  onChange={(e) => setGoodForCreators(e.target.checked)}
                  className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className="text-gray-700 text-sm">Good for creators</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={worthMoney}
                  onChange={(e) => setWorthMoney(e.target.checked)}
                  className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className="text-gray-700 text-sm">Worth the money</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={easyToUse}
                  onChange={(e) => setEasyToUse(e.target.checked)}
                  className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className="text-gray-700 text-sm">Easy to use</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={accurate}
                  onChange={(e) => setAccurate(e.target.checked)}
                  className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className="text-gray-700 text-sm">Accurate</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={reliable}
                  onChange={(e) => setReliable(e.target.checked)}
                  className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className="text-gray-700 text-sm">Reliable</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={beginnerFriendly}
                  onChange={(e) => setBeginnerFriendly(e.target.checked)}
                  className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className="text-gray-700 text-sm">Beginner friendly</span>
              </label>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Comment (optional)
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              maxLength={200}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black placeholder-gray-400"
              placeholder="Share your thoughts..."
            />
            <p className="text-xs text-gray-500 mt-1">{comment.length}/200</p>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || rating === 0}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Saving...' : rating > 0 ? 'Update Review' : 'Submit Rating'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
