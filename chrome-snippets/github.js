/**
 * On workflow page, run this so that you don't have to
 * manually click through this painfully slow workflow.
 */
(() => {
    document
      .querySelectorAll(".timeline-comment-action")
      .forEach((threeDots, index) => {
          // Seems there is some flooding protection on GitHub, so let's
          // just take one at the time, and not the latest build
        if (index !== 2) {
          return;
        }
  
        threeDots.click();
  
        const confirmDeleteBtn =
          threeDots.parentElement.querySelector(".menu-item-danger");
  
        confirmDeleteBtn.click();
  
        // Wait for modal to appear
        setTimeout(() => {
          const confirmDeleteModal = threeDots.parentElement.querySelector(
            "div[data-view-component]"
          );
  
          const deleteButton = confirmDeleteModal.parentElement.querySelector(
            "button[type='submit']"
          );
  
          if (deleteButton) {
            deleteButton.click();
  
            console.log("deleting");
          }
        }, 50);
      });
  })();
  