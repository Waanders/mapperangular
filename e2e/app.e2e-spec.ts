import { Ng2mapperPage } from './app.po';

describe('ng2mapper App', () => {
  let page: Ng2mapperPage;

  beforeEach(() => {
    page = new Ng2mapperPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
