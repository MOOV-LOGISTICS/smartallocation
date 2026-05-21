import React from 'react';
import { motion } from 'framer-motion';
import { History, RotateCcw, X } from 'lucide-react';

interface VersionRecord {
  id: string;
  version: number;
  filename?: string;
  uploader: string;
  timestamp: string;
  data: any[];
}

interface VersionHistoryProps {
  versions: VersionRecord[];
  onClose: () => void;
  onRestore: (version: VersionRecord) => void;
}

export function VersionHistory({ versions, onClose, onRestore }: VersionHistoryProps) {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50" style={{ background: 'rgba(0,0,0,0.3)' }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-xl p-6 w-[600px] shadow-lg max-h-[80vh] flex flex-col"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5" style={{ color: 'var(--accent)' }} />
            <h3 className="text-base font-semibold">Version History</h3>
          </div>
          <button onClick={onClose} style={{ color: 'var(--text2)' }}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-3">
          {versions.length === 0 ? (
            <div className="text-center py-8 text-sm" style={{ color: 'var(--text3)' }}>
              No version history available
            </div>
          ) : (
            [...versions].reverse().map((v) => (
              <div 
                key={v.id} 
                className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                style={{ borderColor: 'var(--border)' }}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs px-1.5 py-0.5 rounded" style={{ background: 'var(--accent-light, #EEF4FF)', color: 'var(--accent)' }}>
                      v{v.version}
                    </span>
                    <span className="font-medium text-sm truncate max-w-[280px]" style={{ color: 'var(--text)' }}>
                      {v.filename || `Version ${v.version}`}
                    </span>
                  </div>
                  <span className="text-xs flex-shrink-0" style={{ color: 'var(--text3)' }}>{v.timestamp}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-xs" style={{ color: 'var(--text2)' }}>
                    Uploaded by <span className="font-medium">{v.uploader}</span> · {v.data.length} records
                  </div>
                  <button
                    onClick={() => onRestore(v)}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors btn-primary"
                  >
                    <RotateCcw className="w-3 h-3" /> Restore
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </motion.div>
    </div>
  );
}
