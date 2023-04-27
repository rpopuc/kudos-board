import PanelRepository from '@/domains/Panel/Repositories/PanelRepository';
import Panel from '@/domains/Panel/Entities/Panel';

describe('PanelRepository', () => {
  describe('create', () => {
    it('should create a PanelEntity', () => {
      const panelRepository = new PanelRepository();
      const panelData = {
        title: 'Test Panel'
      };

      const panelEntity = panelRepository.create(panelData);

      expect(panelEntity).toBeInstanceOf(Panel);
      expect(panelEntity.slug).not.toBeUndefined();
      expect(panelEntity.title).toBe(panelData.title);
    });
  });
});
