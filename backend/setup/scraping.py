from bs4 import BeautifulSoup
import requests

class FAQScraper:
    def __init__(self):
        self.base_url = "https://support.highrise.game/en/"
        
    def get_page(self, url):
        try:
            res = requests.get(url)
            return BeautifulSoup(res.content, 'html.parser')
        except Exception as e:
            print(f"Error fetching page: {e}")
            return None
        
    def get_collections(self):
        collected_data = []
        soup = self.get_page(self.base_url)
        collections = soup.find_all(attrs={'data-testid': 'collection-card-compact'})
        for collection in collections:
            collection_info = {
            "url" : collection['href'],
            "name" : collection.find(attrs={'data-testid': 'collection-name'}).text,
            "article_count" : collection.find('span', class_='text-body-secondary-color').text.split()[0]
            }
            collection_info["articles"] = self.get_articles(collection_info["url"])
            collected_data.append(collection_info)
        return collected_data
    
    def get_articles(self, collection_url):
        collection_page = self.get_page(collection_url)
        articles = collection_page.find_all(attrs={'data-testid': 'article-link'})
        article_data = []
        for article in articles:
            article_info = {
                "title": article.find('span').text,
                "url": article['href'],
                "content": self.get_article_content(article['href'])
            }
            article_data.append(article_info)
        return article_data            
            
    def get_article_content(self, article_url):
        print(f"\nGetting content for: {article_url}")
        article_page = self.get_page(article_url)
        
        content = {
            "sections": [],
            "related_articles": []
        }
        main_content = article_page.find('div', class_='article_body')
        if main_content:
            main_paragraphs = main_content.find_all('div', class_='intercom-interblocks-paragraph')
            if main_paragraphs:
                content["sections"].append({
                    "heading": "Main Content",
                    "content": []
                })
                for paragraph in main_paragraphs:
                    if p_tag := paragraph.find('p'):
                        content["sections"][0]["content"].append({
                            "type": "paragraph",
                            "text": p_tag.text
                        })
        current_section = None
        for element in article_page.find_all(['div']):
            if 'intercom-interblocks-subheading' in element.get('class', []):
                print("Found heading:", element.find('h2').text)
                current_section = {
                    "heading": element.find('h2').text,
                    "content": []
                }
                content["sections"].append(current_section)
                
            elif current_section and 'intercom-interblocks-ordered-nested-list' in element.get('class', []):
                print("Found list in section:", current_section["heading"])
                list_items = []
                for li in element.find_all('li'):
                    p_tag = li.find('p')
                    if p_tag and p_tag.text:
                        list_items.append(p_tag.text)
                    else:
                        list_items.append(li.text.strip())
                
                if list_items:
                    current_section["content"].append({
                        "type": "list",
                        "items": list_items
                    })
                    
            elif current_section and 'intercom-interblocks-paragraph' in element.get('class', []):
                p_tag = element.find('p')
                if p_tag and p_tag.text:
                    current_section["content"].append({
                        "type": "paragraph",
                        "text": p_tag.text
                    })
        related_section = article_page.find('section', class_=['jsx-62724fba150252e0', 'related_articles', 'my-6'])
        if related_section:
            article_links_section = related_section.find('section', class_=['flex', 'flex-col', 'rounded-card'])
            if article_links_section:
                for article_link in article_links_section.find_all(attrs={'data-testid': 'article-link'}):
                    related = {
                        "title": article_link.find('span', class_='text-body-primary-color').text,
                        "url": article_link['href']
                    }
                    content["related_articles"].append(related)
                    
        return content
if __name__ == "__main__":
    scraper = FAQScraper()
    
    print("Getting Collections...")
    collections = scraper.get_collections()
    print(f"Found {len(collections)} collections")
    
    # Test with first collection
    print("\nTesting first collection:")
    first_collection = collections[0]
    print(first_collection)
            
        
        
        
    