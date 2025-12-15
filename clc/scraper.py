#!/usr/bin/env python3
"""
CLC Website Scraper
Scrapes content and images from Cheltenham Ladies' College website
for the personalised prospectus system.
"""

import requests
from bs4 import BeautifulSoup
import os
import json
from urllib.parse import urljoin, urlparse
import time
import re

# Base configuration
BASE_URL = "https://www.cheltladiescollege.org"
OUTPUT_DIR = "/Users/robertottley/clc-prospectus/scraped-content"

# URLs to scrape
URLS = [
    "/",
    "/welcome/principal",
    "/welcome/why-clc",
    "/welcome/purpose",
    "/welcome/our-history",
    "/welcome/strategy",
    "/welcome/future",
    "/welcome/leadership-at-college",
    "/apply/joining",
    "/apply/visits",
    "/apply/day",
    "/apply/uk-boarders",
    "/apply/international-boarders",
    "/apply/fees",
    "/apply/bursaries",
    "/apply/scholarships",
    "/learn/our-curriculum",
    "/learn/exam-results",
    "/learn/lower-college",
    "/learn/upper-college",
    "/learn/sixth-form-college",
    "/learn/sixthformcentre",
    "/learn/beyond-clc",
    "/learn/departments",
    "/learn/scholars",
    "/learn/the-school-week",
    "/learn/facilities-digital",
    "/learn/library",
    "/experience/clubs-and-societies",
    "/experience/the-arts",
    "/experience/sport-outdoor",
    "/experience/volunteering-fundraising",
    "/experience/weekends",
    "/life/pastoral-care",
    "/life/boarding",
    "/life/day-girls",
    "/life/medical-health",
    "/life/chaplaincy-and-worship",
    "/life/wellbeing-programme",
    "/life/nutrition",
    "/life/our-town",
    "/life/clc-voices",
    "/news/current-news",
    "/news/blogs",
    "/information/contact-us",
    "/information/visiting",
    "/information/term-dates",
    "/information/inspection",
]

# Headers to mimic browser
HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    'Accept-Language': 'en-GB,en;q=0.5',
}

def create_directories():
    """Create output directory structure"""
    dirs = [
        OUTPUT_DIR,
        f"{OUTPUT_DIR}/pages",
        f"{OUTPUT_DIR}/images",
        f"{OUTPUT_DIR}/content",
    ]
    for d in dirs:
        os.makedirs(d, exist_ok=True)
    print(f"Created directories in {OUTPUT_DIR}")

def scrape_page(url):
    """Scrape a single page and return content"""
    full_url = urljoin(BASE_URL, url)
    try:
        response = requests.get(full_url, headers=HEADERS, timeout=30)
        response.raise_for_status()
        return response.text
    except Exception as e:
        print(f"Error scraping {full_url}: {e}")
        return None

def extract_content(html, url):
    """Extract text content and images from HTML"""
    soup = BeautifulSoup(html, 'html.parser')

    # Get page title
    title = soup.find('title')
    title_text = title.get_text(strip=True) if title else ""

    # Remove script and style elements
    for element in soup(['script', 'style', 'nav', 'footer', 'noscript']):
        element.decompose()

    # Get main content
    main_content = soup.find('main') or soup.find('article') or soup.find(class_=re.compile(r'content|main', re.I)) or soup.find('body')

    # Extract text
    text = main_content.get_text(separator='\n', strip=True) if main_content else ""

    # Extract headings
    headings = []
    for h in soup.find_all(['h1', 'h2', 'h3']):
        headings.append({
            'level': h.name,
            'text': h.get_text(strip=True)
        })

    # Extract images
    images = []
    for img in soup.find_all('img'):
        src = img.get('src') or img.get('data-src') or img.get('data-lazy-src')
        if src:
            # Skip tiny images, icons, etc.
            if 'icon' in src.lower() or 'logo' in src.lower():
                continue
            images.append({
                'src': urljoin(BASE_URL, src),
                'alt': img.get('alt', ''),
                'class': img.get('class', [])
            })

    # Extract any quotes/testimonials
    quotes = []
    for quote in soup.find_all(['blockquote', 'q']):
        quotes.append(quote.get_text(strip=True))

    # Look for quote-like divs
    for div in soup.find_all(class_=re.compile(r'quote|testimonial', re.I)):
        quotes.append(div.get_text(strip=True))

    return {
        'url': url,
        'full_url': urljoin(BASE_URL, url),
        'title': title_text,
        'headings': headings,
        'text': text,
        'images': images,
        'quotes': quotes,
    }

def download_image(url, output_dir):
    """Download an image"""
    try:
        response = requests.get(url, headers=HEADERS, timeout=30)
        response.raise_for_status()

        # Get filename from URL
        parsed = urlparse(url)
        filename = os.path.basename(parsed.path)
        if not filename or '.' not in filename:
            # Generate filename from hash
            ext = '.jpg'
            if 'png' in url.lower():
                ext = '.png'
            elif 'webp' in url.lower():
                ext = '.webp'
            filename = f"image_{abs(hash(url)) % 10000}{ext}"

        # Clean filename
        filename = re.sub(r'[^\w\-_\.]', '_', filename)

        filepath = os.path.join(output_dir, filename)
        with open(filepath, 'wb') as f:
            f.write(response.content)

        return filename
    except Exception as e:
        print(f"Error downloading {url}: {e}")
        return None

def extract_brand_colours(html):
    """Try to extract brand colours from CSS"""
    colours = []
    # Look for inline styles and style tags
    soup = BeautifulSoup(html, 'html.parser')
    for style in soup.find_all('style'):
        text = style.get_text()
        # Find hex colours
        hex_colours = re.findall(r'#[0-9a-fA-F]{6}', text)
        colours.extend(hex_colours)
    return list(set(colours))

def main():
    """Main scraping function"""
    create_directories()

    all_content = []
    all_images = set()
    brand_colours = set()

    print(f"\nScraping {len(URLS)} pages from {BASE_URL}...")
    print("-" * 50)

    for i, url in enumerate(URLS, 1):
        print(f"[{i}/{len(URLS)}] Scraping: {url}")
        html = scrape_page(url)

        if html:
            content = extract_content(html, url)
            all_content.append(content)

            # Collect unique images
            for img in content['images']:
                all_images.add(img['src'])

            # Try to get brand colours from homepage
            if url == "/":
                colours = extract_brand_colours(html)
                brand_colours.update(colours)

            # Save page content as text
            page_name = url.replace('/', '_').strip('_') or 'home'
            with open(f"{OUTPUT_DIR}/content/{page_name}.txt", 'w', encoding='utf-8') as f:
                f.write(f"URL: {content['full_url']}\n")
                f.write(f"Title: {content['title']}\n")
                f.write("=" * 50 + "\n\n")
                f.write(content['text'])

            # Save raw HTML
            with open(f"{OUTPUT_DIR}/pages/{page_name}.html", 'w', encoding='utf-8') as f:
                f.write(html)

        time.sleep(1)  # Be polite to the server

    # Save all content as JSON
    with open(f"{OUTPUT_DIR}/all_content.json", 'w', encoding='utf-8') as f:
        json.dump(all_content, f, indent=2, ensure_ascii=False)

    # Save image list
    with open(f"{OUTPUT_DIR}/image_list.json", 'w', encoding='utf-8') as f:
        json.dump(list(all_images), f, indent=2)

    # Save brand colours found
    with open(f"{OUTPUT_DIR}/brand_colours.json", 'w', encoding='utf-8') as f:
        json.dump(list(brand_colours), f, indent=2)

    print("-" * 50)
    print(f"\nContent scraped: {len(all_content)} pages")
    print(f"Images found: {len(all_images)}")
    print(f"Brand colours found: {len(brand_colours)}")

    # Download images (limit to first 50 to be reasonable)
    print(f"\nDownloading images (max 50)...")
    downloaded = 0
    for img_url in list(all_images)[:50]:
        result = download_image(img_url, f"{OUTPUT_DIR}/images")
        if result:
            downloaded += 1
            print(f"  Downloaded: {result}")
        time.sleep(0.5)

    print("-" * 50)
    print(f"\nScraping complete!")
    print(f"Content saved to: {OUTPUT_DIR}/")
    print(f"  - all_content.json (structured data)")
    print(f"  - content/*.txt (text extracts)")
    print(f"  - pages/*.html (raw HTML)")
    print(f"  - images/ ({downloaded} images)")

if __name__ == "__main__":
    main()
