import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useStore } from '../stores/useStore';
import { TemplateEditor } from '../components/TemplateEditor';
import { Button } from '../components/Button';
import { LoadingScreen } from '../components/LoadingScreen';
import type { CardTemplate } from '../types';

export interface TemplateEditorPageProps {
  templates: CardTemplate[];
  setTemplates: (templates: CardTemplate[]) => void;
}

export const TemplateEditorPage: React.FC<TemplateEditorPageProps> = ({
  templates,
  setTemplates
}) => {
  const navigate = useNavigate();

  return (
    <motion.div
      className="template-editor-page"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <motion.div 
        className="page-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="header-left">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate('/gallery')}
            leftIcon="←"
          >
            Back to Gallery
          </Button>
        </div>
        <div className="header-center">
          <h1 className="page-title">Template Editor</h1>
          <p className="page-subtitle">
            Create and customize card templates
          </p>
        </div>
        <div className="header-right">
          <Button 
            variant="secondary" 
            size="sm" 
            onClick={() => navigate('/editor/theme')}
            leftIcon="🎭"
          >
            Themes
          </Button>
        </div>
      </motion.div>

      {/* Content */}
      <div className="page-content">
        <TemplateEditor
          templates={templates}
          setTemplates={setTemplates}
          onClose={() => navigate('/gallery')}
        />
      </div>
    </motion.div>
  );
};

export default TemplateEditorPage;
