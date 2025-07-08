import React, { useState, useEffect } from 'react'
import { X, Settings, Save } from 'lucide-react'
import useLRCStore from '../stores/lrcStore'
import { useTranslation } from '../i18n/translations'

const MetadataModal = () => {
  const {
    showMetadataModal,
    metadata,
    setShowMetadataModal,
    updateMetadata,
    duration
  } = useLRCStore()
  const { t } = useTranslation()

  const [formData, setFormData] = useState({})

  useEffect(() => {
    if (showMetadataModal) {
      setFormData({
        ...metadata,
        length: duration ? `${Math.floor(duration / 60)}:${Math.floor(duration % 60).toString().padStart(2, '0')}` : metadata.length
      })
    }
  }, [showMetadataModal, metadata, duration])

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSave = () => {
    Object.keys(formData).forEach(key => {
      updateMetadata(key, formData[key])
    })
    setShowMetadataModal(false)
  }

  const handleCancel = () => {
    setShowMetadataModal(false)
  }

  if (!showMetadataModal) return null

  return (
    <div className="modal-overlay">
      <div className="modal-content max-w-lg">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <Settings className="text-blue-500" size={24} />
            <h2 className="text-xl font-semibold text-gray-800">{t('songMetadata')}</h2>
          </div>
          <button
            onClick={handleCancel}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('title')}
            </label>
            <input
              type="text"
              value={formData.title || ''}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder={t('title')}
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('artist')}
            </label>
            <input
              type="text"
              value={formData.artist || ''}
              onChange={(e) => handleChange('artist', e.target.value)}
              placeholder={t('artist')}
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('album')}
            </label>
            <input
              type="text"
              value={formData.album || ''}
              onChange={(e) => handleChange('album', e.target.value)}
              placeholder={t('album')}
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('author')}
            </label>
            <input
              type="text"
              value={formData.author || ''}
              onChange={(e) => handleChange('author', e.target.value)}
              placeholder={t('author')}
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('length')}
            </label>
            <input
              type="text"
              value={formData.length || ''}
              onChange={(e) => handleChange('length', e.target.value)}
              placeholder="4:15"
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('lrcCreator')}
            </label>
            <input
              type="text"
              value={formData.by || ''}
              onChange={(e) => handleChange('by', e.target.value)}
              placeholder={t('lrcCreator')}
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('offset')}
            </label>
            <input
              type="number"
              value={formData.offset || 0}
              onChange={(e) => handleChange('offset', parseInt(e.target.value) || 0)}
              placeholder="0"
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">
              {t('offsetNote')}
            </p>
          </div>
        </div>

        <div className="flex justify-end space-x-3 mt-6">
          <button
            onClick={handleCancel}
            className="btn-secondary"
          >
            {t('cancel')}
          </button>
          <button
            onClick={handleSave}
            className="btn-primary flex items-center space-x-2"
          >
            <Save size={16} />
            <span>{t('saveMetadata')}</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default MetadataModal
