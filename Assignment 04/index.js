const fs = require('fs');

const initialContent = `Name: Piyush Owalekar
Course: Full Stack Web Dev.
Technology: HTML, CSS, JavaScript, Node.js`;

fs.writeFile('student.txt', initialContent, (err) => {
  if (err) {
    console.error('Error creating file:', err);
    return;
  }
  console.log('File created successfully');

  fs.readFile('student.txt', 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading file:', err);
      return;
    }
    console.log('\n--- Student Details ---');
    console.log(data);

    const additionalContent = '\nExperience: 2 Year\nCity: mumbai';

    fs.appendFile('student.txt', additionalContent, (err) => {
      if (err) {
        console.error('Error updating file:', err);
        return;
      }
      console.log('\nData updated successfully');

      fs.rename('student.txt', 'studentDetails.txt', (err) => {
        if (err) {
          console.error('Error renaming file:', err);
          return;
        }
        console.log('File renamed from student.txt to studentDetails.txt');

        fs.unlink('studentDetails.txt', (err) => {
          if (err) {
            console.error('Error deleting file:', err);
            return;
          }
          console.log('File studentDetails.txt deleted successfully');
        });
      });
    });
  });
});